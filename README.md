# react-router-tween

Provides tweening state transitions for [react-router](https://github.com/rackt/react-router) on route entrances and exits.


<br>

RRT binds `this.state.presence` in a component, which tweens from 0 to 1 when the component is mounted. When our route changes, the `presence` variable tweens back to 0 and the component is unmounted.


RRT uses [react-set-state-tween](https://github.com/freshdried/react-set-state-tween), a promises wrapper around [react-tween-state](https://github.com/chenglou/react-tween-state)
<br>


## install

```
npm install --save react-router-tween
```


## example

1. Outer is mounted. Outer fades in...
2. Inner1 is mounted. Inner1 fades in...

*when route switches to Inner2*

1. Inner1 fades out... Inner1 is unmounted.
2. Inner2 is mounted. Inner2 fades in...

```javascript
import React from "react"
import Promise from "bluebird"
import RRT from "react-router-tween"
import Router from "react-router"

const {Route, DefaultRoute, RouteHandler} = Router;

const Outer = React.createClass({
    mixins: [RRT],
    render() {
        let presence = this.getTweeningValue("presence");
        let style = { opacity: presence };

        let routehandler = (presence === 1)
            ? <RouteHandler/>
            : null;

        return (<div style={style}>
            <h1>Hello World</h1>
            <div>
                <Link to={"/"}>Home (Inner1)</Link>
            </div>
            <div>
                <Link to={"/2"}>Inner2</Link>
            </div>
            {routehandler}
        </div>)
    }
});

const Inner1 = React.createClass({
    mixins: [RRT],
    render() {
        let presence = this.getTweeningValue("presence");
        let style = { opacity: presence};

        return (<p style={style}>
            This is Inner1
        </p>)
    }
});

const Inner2 = React.createClass({
    mixins: [RRT],
    render() {
        let presence = this.getTweeningValue("presence");
        let style = { opacity: presence};

        return (<p style={style}>
            This is Inner2
        </p>)
    }
});

const routes = (
    <Route path="/" handler={Outer}>
        <DefaultRoute handler={Inner1}/>
        <Route path="/2" handler={Inner2}/>
    </Route>
);

Router.run(routes, Router.HashLocation, (Handler) => React.render(<Handler/>, document.body));
```
## usage
#### Override the default entrance behavior by providing `this.onEnter()`
`this.onEnter() -> Promise`


```javascript
    // default onEnter
    ...
    onEnter() {
        return this.setStateTween({presence: 1}, {
            duration: 300,
            easing: tweenState.easingTypes.easeInOutQuad
        });
    }
    ...
```

#### Override the default exit behavior by providing `this.onExit()`
`this.onExit() -> Promise`



```javascript
    // default onExit
    ...
    onExit() {
        return this.setStateTween({presence: 0}, {
            duration: 300,
            easing: tweenState.easingTypes.easeInOutQuad
        });
    }
    ...
```

#### example onExit and onEnter
- Inner3 is mounted.
- Inner3 tweens `presence`to 1 (linear, 500ms)
- Inner3 tweens `presence` to 0 (easeInOutQuad, 1000ms)
- Inner3 tweens `presence` to 1 (easeInOutQuad, 1000ms)

*when route changes*
- Inner3 tweens `presence` to 0 (easeInOutQuad, 1000ms)

```javascript
import tweenState from "react-tween-state"
...

const Inner3 = React.createClass({
    mixins: [RRTT],

    enterTween() {
        return this.setStateTween({presence: 1}, {
                duration: 500,
                easing: tweenState.easingTypes.linear
            })
            .then(() => this.setStateTween({presence: 0}, {duration: 1000}))
            .then(() => this.setStateTween({presence: 1}, {duration: 1000}));
    },
    exitTween() {
        return this.setStateTween({presence: 0}, {duration: 1000});
    },

    render() {
        let presence = this.getTweeningValue("presence");
        let style = { opacity: presence };

        return (<p style={style}>
            This is Inner3.
        </p>);
    }
});

...
```
