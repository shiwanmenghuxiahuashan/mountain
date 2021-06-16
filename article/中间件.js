function mid1(next) {
    return () => {
        console.log('中 mid1 前 ')
        next()
        console.log('中 mid1 后 ')
    }
}

function mid2(next) {
    return () => {
        console.log('中mid2 前 ')
        next()
        console.log('中mid2 后 ')
    }
}

function mid3(next) {

    return () => {
        console.log('中 mid3 前 ')
        next()
        console.log('中 mid3 后 ')
    }
}
var noop = () => {
    console.log('noop')
    return ()=>{
        console.log('666')

    }
};
 mid1(mid2(mid3(noop)))()