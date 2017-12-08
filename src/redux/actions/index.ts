let id = 0;
const exampleAction = text => {
    console.log('exampeExample called');
    return {
        type: 'EXAMPLE_ACTION',
        text: text,
        id: id++
    }
}

export default exampleAction;