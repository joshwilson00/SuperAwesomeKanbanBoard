function allowDrop(event){
    event.preventDefault();
}
function onDrag(event) {
    event.dataTransfer.setData("text", event.target.id);
    console.log('Dragging:', event.target.id);
}

function onDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    console.log('Dropped:',id);
}
