const view = state => `
<div class='profileContainer'>
    <div class='profileHeader'>
        <button class='button profileButton'>Back</button>
        <img src="${state.user.avatar}" />
        <h2>${state.user.name}</h2>
    </div>
    <div class='userTimes'>
        <small>User created: ${new Date(state.user.createdAt)}</small>
        <br/>
        <small>User last updated: ${new Date(state.user.updatedAt)}</small>
    </div>
    <div class="profileContent">
        <h4>Current working on</h4>
    </div
</div>
`

const update = {

}

app.start('profile', state, view, update);