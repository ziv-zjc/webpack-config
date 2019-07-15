// import { helloword } from './helloword'
// import '../../common'
// let a = 1


function bibao () {
    var cache = []
    return function () {
        cache.push("123")
        return cache
    }
}

function deepClone (initalObj, finalObj) {
    let { keys } = Object
    let obj = finalObj || {}
    for (let key of keys(initalObj)) {
        let prop = initalObj[key]
        if (prop == obj) {
            continue
        }
        if (typeof prop === 'object') {
            obj[key] = prop.constructor === Array ? [] : {}
            arguments.callee(prop, obj[key])
        } else {
            obj[key] = prop
        }
    }
    return obj

}

function debounce (fn, delay) {
    let timer = null
    return function () {
        let context = this
        let args = arguments
        if (!timer) {
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(() => {
            fn.apply(context, args)
        }, delay);
    }
}

function throttle (fn, delay) {
    let timer = null
    return function () {
        let context = this
        let args = arguments
        if (!timer) {
            timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
                fn.apply(context, args)
            }, delay)
        }

    }
}

function quickSort (ary) {
    let mid = Math.floor(ary.length / 2)
    let pivot = ary.splice(mid, 1); //删除基准项，并把基准项赋值给pivot；
    let left = [],
        right = []
    for (let i; i < ary.length; i++) {
        if (ary[i] <= pivot) {
            left.push(ary[i])
        } else {
            right.push(ary(i))
        }
    }
    return quickSort(left).concat(pivot, quickSort(right))
}