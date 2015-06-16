let Promise = require("bluebird");
let SetStateTween = require("react-set-state-tween");
// let {TransitionHook} = require("react-router");


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

    routerWillLeave: function(callback) {
        return this._exitTween()
            .then( () => callback() )

            // If it's still mounted, we probably switched out and switched back too fast
            // so we need to renanimate the mounting.

            .then( cancelIfNotMounted(this) )
            .then( this._enterTween)
            .catch(Promise.CancellationError, (e) => null)
    },
    getInitialState () {
        return {presence: 0}
    },
    componentDidMount () {
        return this._enterTween();
    },
    // onEnter (nextState, transition) {
    //     console.log(nextState, transition)
    // },




    // enterTween() {
    //     // To be specified by the user
    // },

    // exitTween() {
    //     // To be specified by the user
    // },
    









    //returns Promise
    _enterTween () {
        const enterTweenDefault = 
            () => this.setStateTween({presence: 1}, {duration: 300});

        const enterTween = (typeof this.enterTween === "function" )
            ? this.enterTween
            : enterTweenDefault;

        return Promise.try(cancelIfNotMounted(this))
            .then( enterTween )
            .catch(Promise.CancellationError, (e) => null)

    },

    //returns Promise
    _exitTween () {
        const exitTweenDefault = 
            () => this.setStateTween({presence: 0}, {duration: 300});

        const exitTween = (typeof this.exitTween === "function" )
            ? this.exitTween
            : exitTweenDefault

        return Promise.try(exitTween);

    },

}

module.exports = RRT;
