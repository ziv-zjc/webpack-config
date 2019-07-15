'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
// import '../../common'
import './search.scss';
// import { a } from './tree-shaking'

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
        return <div> {Text ? < Text /> : null}Search Text <img onClick={this.loadComponent.bind(this)} src="" /></div>
    }
}


ReactDOM.render(<Search />, document.getElementById('root'));