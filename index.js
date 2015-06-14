let Promise = require("bluebird");
let SetStateTween = require("react-set-state-tween");

//PeerDeps: react-router, react

function cancelIfNotMounted(ctx) {
    return function() {
        if (!this.isMounted()) { 
            throw new Promise.CancellationError()
        }
        return null;
    }.bind(ctx)
}

let RRT = {
    mixins: [SetStateTween],
    statics: {
        willTransitionFrom: function(transition, component, callback) {
            if (!component) return callback();
            return component._exitTween()
                .then( () => callback() )

                // If it's still mounted, we probably switched out and switched back too fast
                // so we need to renanimate the mounting.

                .then( cancelIfNotMounted(component) )
                .then( component._enterTween)
                .catch(Promise.CancellationError, (e) => null)
        }
    },
    getInitialState() {
        return {presence: 0}
    },
    componentDidMount() {
        return this._enterTween();
    },




    // enterTween() {
    //     // To be specified by the user
    // },

    // exitTween() {
    //     // To be specified by the user
    // },
    









    _enterTweenDefault() {
        return this.setStateTween({presence: 1}, {duration: 300} )
    },

    _exitTweenDefault() {
        return this.setStateTween({presence: 0}, {duration: 300});
    },








    //returns Promise
    _enterTween() {
        const enterTween = (typeof this.enterTween === "function" )
            ? this.enterTween
            : this._enterTweenDefault;

        return Promise
            .try(  cancelIfNotMounted(this) )
            .then( enterTween )
            .catch(Promise.CancellationError, (e) => null)

    },

    //returns Promise
    _exitTween() {
        const exitTween = (typeof this.exitTween === "function" )
            ? this.exitTween
            : this._exitTweenDefault

        return Promise.try(exitTween);

    },

}

module.exports = RRT;
