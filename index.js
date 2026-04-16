// tabActive and inactive design
let currentTab = "all";
const tabActive = ["text-white", "bg-[#4a00ff]"];
const tabInactive = ["border", "border-[#e4e4e7]", "bg-white"];

// login
let loginForm = document.getElementById('login-form');

let userName = document.getElementById('user-name');

let password = document.getElementById('pass');

let signIn = document.getElementById('sign-in');

if (signIn) {

    signIn.addEventListener('click', (event) => {
        event.preventDefault();         //to prevent auto reloading...joss kintu
        if (userName.value === 'admin' && password.value == 'admin123') {
            window.location.href = 'all-cards.html'
        }
        else if (userName.value == '' || password.value == '') {
            alert("username or password can't be empty");

        }
        else {
            alert('username should be admin and password must be admin123');
        }
    });
}


// status button
function switchTab(tab) {
    const buttons = ['all', 'open', 'closed'];

    for (const b of buttons) {
        const btn = document.getElementById(b + '-btn')
        console.log(btn);

        if (b === tab) {
            btn.classList.add(...tabActive)
            btn.classList.remove(...tabInactive)
        }
        else {
            btn.classList.add(...tabInactive)
            btn.classList.remove(...tabActive);
        }

    }
    allIssues(tab)
}

const spinner = document.getElementById('spinner');
const container = document.getElementById('card-container');
// all issues api
const allIssues = (status = 'all') => {

    spinner.classList.remove('hidden');
    container.classList.add('hidden')

    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues ")
        .then((res) => (res.json()))
        .then((json) => {
            let data = json.data;
            if (status !== 'all') {
                data = data.filter(issues => issues.status === status);
            }
            displayAll(data)
            spinner.classList.add('hidden');
            container.classList.remove('hidden')
        })
};

// display issues
const displayAll = (all) => {

    container.innerHTML = " ";

    const countDisplay = document.getElementById('count');
    if (countDisplay) {
        countDisplay.innerText = all.length
    }
    for (let one of all) {

        let labelsIcon = "";
        if (one.labels && one.labels.length > 0) {
            for (const label of one.labels) {
                const bug = label.toLowerCase() === 'bug'
                const labelColor = bug ? 'bg-[#feecec] text-[#ef4444] border-[#fecaca]'
                    : 'bg-[#FFF8DB] text-[#D97706] border-[#FDE68A]';
                const icon = bug ? './assets/bug.png' : './assets/help.png';

                labelsIcon += `
            <span class="flex items-center gap-1 px-3 py-1 rounded-full border text-[10px] font-bold uppercase whitespace-nowrap ${labelColor}">
                        <img class="w-3 h-3" src="${icon}" alt="">
                        ${label}
                    </span>`;


            }
        }

        const cardDiv = document.createElement('div');
        const borderColor = one.status === 'open' ? 'border-t-4 border-t-[#00a96e]' : 'border-t-4 border-t-[#a855f7]';
        const statusIcon = one.status === 'open' ? './assets/Open-Status.png' : './assets/Closed-Status.png';
        cardDiv.className = `bg-white shadow-sm p-4 rounded-b-lg flex flex-col justify-between ${borderColor}`;

        cardDiv.innerHTML = `
    <div class>
      <div class="flex justify-between items-center">
      
        <img class="" src="${statusIcon}" alt="">
        <p class="priority w-20 bg-[#feecec] text-center rounded-2xl p-1">
        <span class="text-[#ef4444] text-[12px]">${one.priority}</span></p>
      </div>

      <div class="mt-2">
        <h3 class="font-semibold text-[14px] mb-2">${one.title}</h3>
        <p class="text-[12px] text-[#64748B]">${one.description}</p>
        <div class="label flex items-center gap-5 rounded-2xl mt-3 flex-wrap">
            ${labelsIcon}
        </div>
      </div>

      <div class="mt-3 text-[#64748B] text-[12px] border-t border-t-[#64748B] pt-2 flex flex-col gap-1">
        
        <p class="">#${one.id} ${one.author}</p>
        <p>${new Date(one.createdAt).toLocaleDateString()}</p>
      </div>  
      </div>
        `
            ;
        container.appendChild(cardDiv);
    }

}
switchTab(currentTab)
