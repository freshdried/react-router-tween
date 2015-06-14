# react-router-tween

Provides tweening state transitions for [react-router](https://github.com/rackt/react-router) on route entrances and exits.


<br>

RRT binds `this.state.presence` in a component, which tweens from 0 to 1 when the component is mounted. When our route changes, the `presence` variable tweens back to 0 and the component is unmounted.

<br>

RRT uses [react-set-state-tween](https://github.com/freshdried/react-set-state-tween), a promises wrapper around [react-tween-state](https://github.com/chenglou/react-tween-state)

<br>
<br>

## install

```
npm install --save react-router-tween
```


## example
*on page load:*

- Outer is mounted.
- Outer tweens `presence` from 0 to 1. (opacity fade-in)
- InnerA is mounted.
- InnerA tweens `presence` from 0 to 1. (opacity fade-in)


*when route switches to InnerB:*

- InnerA tweens `presence` from 1 to 0. (opacity fade-out)
- InnerA is unmounted.
- InnerB is mounted.
- InnerB tweens `presence` from 0 to 1. (opacity fade-in)

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

        //Here we specify to mount subroutes only when the fade-in completes.
        //We could very much mount RouteHandler directly, so that
        //Outer and Inner would fade-in in parallel
    
        let routehandler = (presence === 1)
            ? <RouteHandler/>
            : null;

        return (<div style={style}>
            <h1>Hello World</h1>
            <div>
                <Link to={"/"}>Home (InnerA)</Link>
            </div>
            <div>
                <Link to={"/B"}>InnerB</Link>
            </div>
            {routehandler}
        </div>)
    }
});

const InnerA = React.createClass({
    mixins: [RRT],
    render() {
        let presence = this.getTweeningValue("presence");
        let style = { opacity: presence}; //fade-in and fade-out

        return (<p style={style}> A </p>)
    }
});

const InnerB = React.createClass({
    mixins: [RRT],
    render() {
        let presence = this.getTweeningValue("presence");
        let style = { opacity: presence}; //fade-in and fade-out

        return (<p style={style}> B </p>)
    }
});

const routes = (
    <Route path="/" handler={Outer}>
        <DefaultRoute handler={InnerA}/>
        <Route path="/B" handler={InnerB}/>
    </Route>
);

Router.run(routes, Router.HashLocation,
    (Handler) => React.render(<Handler/>, document.body));
```
## custom tweening behavior
#### Override entrance behavior by providing `this.enterTween()`
`this.enterTween() -> Promise`


```javascript
    // default enterTween
    ...
    enterTween() {
        return this.setStateTween({presence: 1}, {
            duration: 300,
            easing: tweenState.easingTypes.easeInOutQuad
        });
    }
    ...
```

#### Override exit behavior by providing `this.exitTween()`
`this.exitTween() -> Promise`



```javascript
    // default exitTween
    ...
    exitTween() {
        return this.setStateTween({presence: 0}, {
            duration: 300,
            easing: tweenState.easingTypes.easeInOutQuad
        });
    }
    ...
```

#### example custom tweens
*when route changes to InnerC*
- InnerC is mounted.
- InnerC tweens `presence`to 1 (linear, 500ms)
- InnerC tweens `presence` to 0 (easeInOutQuad, 1000ms)
- InnerC tweens `presence` to 1 (easeInOutQuad, 1000ms)

*when route changes out*
- InnerC tweens `presence` to 0 (easeInOutQuad, 1000ms)

```javascript
import tweenState from "react-tween-state"
...

const InnerC = React.createClass({
    mixins: [RRT],

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

        return (<p style={style}> C </p>);
    }
});

...
```
