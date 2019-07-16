'use strict';

// import React from 'react'; 
// import './search.scss';
//服务器端渲染不支持import，支持cmjs
const React = require('react')
require('./search.scss')


class Search extends React.Component {
    constructor() {
        super(...arguments)

        this.state = {
            Text: null
        }
    }

    loadComponent () {
        import('./text.js').then((Text) => {
            this.setState({
                Text: Text.default
            })
        })
    }
    render () {
        const { Text } = this.state
        return <div> {Text ? < Text /> : null}Search Text < img onClick={this.loadComponent.bind(this)} src="" /></div>
    }
}





//ReactDOM.render(<Search />, document.getElementById('root'));  服务器端渲染不支持render方法

module.exports = <Search />