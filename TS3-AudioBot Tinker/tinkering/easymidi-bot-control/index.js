const easymidi = require('easymidi');
const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

const inputs = easymidi.getInputs();
const outputs = easymidi.getOutputs();

inputs.forEach(name => {
    const input = new easymidi.Input(name);
    input.on('noteon', (msg) => {
        console.log(name, 'noteon', msg);
    });
    input.on('cc', (msg) => {
        // console.log(name, 'cc', msg);
        const value = Math.round(map(msg.value, 0, 127, 0, 100));
    });
});






console.log(inputs, outputs);