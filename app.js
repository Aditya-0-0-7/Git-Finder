let page=1;
let perPage=10;
let totalPage=1;
let startPage=1;
let selectedPage=1;
let isPaginated=false;
let timer=null;
let callsCompleted=0;
function toast(msg)
{
    const toast=document.createElement('div');
    toast.innerHTML=msg;
    toast.id='toast';
    toast.style.display='flex';
    toast.style.alignItems='center';
    toast.style.justifyContent='center';
    toast.style.backgroundColor='#BB2525';
    toast.style.color='white';
    toast.style.maxWidth='15vw';
    toast.style.minwidth='10vw';
    toast.style.minHeight='5vh';
    toast.style.overflowWrap='break-word';
    toast.style.textAlign='center';
    toast.style.borderRadius='5px';
    toast.style.padding='0.3vw';
    toast.style.position='fixed';
    toast.style.top='5vh';
    toast.style.right='2vw';
    toast.style.zIndex='3';
    document.getElementsByTagName('body')[0].appendChild(toast);
    setTimeout(()=>{
        let body=document.getElementsByTagName('body')[0];
        body.removeChild(document.getElementById('toast'));
    },3000);
}

async function fetchRepo()
{
    try
    {
        const userName=document.getElementById('userInput').value;
        const response=await fetch(`https://api.github.com/users/${userName}/repos?per_page=${perPage}&page=${page}`);
        //finding total pages and adding paging mechanism
        if(!isPaginated&&response.headers.get('Link')!==null)
        {
            const linkHeader=response.headers.get('Link');
            const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
            totalPage= match ? parseInt(match[1]) : 1;
            addPagination();
        }
        else if(!isPaginated&&response.headers.get('Link')===null)
        {
            totalPage=1;
            addPagination();
        }
        isPaginated=true;
        if(response.status===200)
        {
            const data=await response.json();
            addRepo(data);
        }
    }
    catch(e)
    {
        toast('Some Error Occured Try Again');
    }
    ++callsCompleted;
    if(callsCompleted===2)
    {
        document.getElementById('globalLoading').style.display='none';
    }
    document.getElementById('contentLoading').style.display='none';
}

async function fetchProfile()
{
    try
    {
        const userName=document.getElementById('userInput').value;
        const response=await fetch(`https://api.github.com/users/${userName}`);
        if(response.status===200)
        {
            const data=await response.json();
            addProfile(data);
        }
        else if(response.status===404)
        {
            toast("Entered User Name does not seem correct");
        }
        else
        {
            toast("Some Error Occured Try Again");
        }
    }
    catch(e)
    {
        toast('Some Error Occured Try Again');
    }
    ++callsCompleted;
    if(callsCompleted===2)
    {
        document.getElementById('globalLoading').style.display='none';
    }
}

function addProfile(data)
{
    document.getElementById('profile').style.visibility='visible';
    document.getElementById('profileImage').src=`${data.avatar_url}`;
    document.getElementById('userName').innerHTML=`${data.name===null?data.login:data.name}`;
    setWithoutImg(data.bio,document.getElementById('bio'),false);
    setWithImg(data.location,document.getElementById('location'),'./Images/locationIcon.png');
    setWithoutImg(data.twitter_username,document.getElementById('twitter'),true);
    setWithImg(data.url,document.getElementById('url'),'./Images/linkImg.png');

    function setWithImg(value,element,url)
    {
        if(value!==null)
        {
            element.innerHTML='';
            element.hidden=false;
            let imgElement=document.createElement('img');
            imgElement.src=url;
            imgElement.style.height='4vh';
            imgElement.style.width='4vh';
            imgElement.style.padding='1vh';
            element.appendChild(imgElement);
            element.innerHTML=`${element.innerHTML} ${value}`;
        }
        else
        {
            element.innerHTML='';
            element.hidden=true;
        }
    }

    function setWithoutImg(value,element,isTweet)
    {
        if(!isTweet&&value!==null)
        {
            element.hidden=false;
            element.innerHTML=`${value}`;
        }
        else if(isTweet&&value!==null)
        {
            element.hidden=false;
            element.innerHTML=`Twitter: https://twitter.com/${value}`;
        }
        else
        {
            element.innerHTML='';
            element.hidden=true;
        }
    }
}

function addRepo(repoData)
{

    document.getElementById('contentHolder').style.visibility='visible';
    let reposList=document.getElementById('reposList');
    reposList.innerHTML='';
    repoData.forEach(value=>{
        reposList.appendChild(createRepoItem(value));
    });

    function createRepoItem(data)
    {
        let repo=document.createElement('div');
        repo.addEventListener('click',()=>{
            window.location.href=data.html_url;
        });
        repo.style.width='58vw';
        repo.style.height='fit-content';
        repo.style.display='flex';
        repo.style.flexDirection='column';
        repo.style.marginBottom='2vh';
        repo.style.borderRadius='5px';
        repo.style.border='1px solid black';
        repo.style.padding='1vh';
        repo.style.cursor='pointer';
        let repoName=document.createElement('div');
        repoName.innerHTML=data.name;
        repoName.style.fontSize='2vw';
        repoName.style.fontWeight='bold';
        repoName.style.height='fit-content';
        repoName.style.width='58vw';
        repoName.style.margin='0.5vh';
        repoName.style.color='#4d92cf';
        repo.appendChild(repoName);
        if(data.description!==null)
        {
            let repoDes=document.createElement('div');
            repoDes.innerHTML=data.description;
            repoDes.style.fontSize='1.2vw';
            repoDes.style.height='fit-content';
            repoDes.style.width='58vw';
            repoDes.style.overflowWrap='break-word';
            repoDes.style.margin='0.5vh';
            repo.appendChild(repoDes);
        }
        if(data.topics.length>0)
        {
            let repoTopics=document.createElement('div');
            repoTopics.style.width='58vw';
            repoTopics.style.height='fit-content';
            repoTopics.style.display='flex';
            repoTopics.style.flexWrap='wrap';
            repoTopics.style.margin='0.5vh';
            data.topics.forEach(value => {
                let topic=document.createElement('div');
                topic.innerHTML=value;
                topic.style.padding='2px';
                topic.style.backgroundColor='#428bca';
                topic.style.color='white';
                topic.style.margin='5px';
                topic.style.padding='5px';
                topic.style.borderRadius='5px';
                repoTopics.appendChild(topic);
            });
            repo.appendChild(repoTopics);
        }
        return(repo);
    }
}

function addPagination()
{
    let pageNumberHolder=document.getElementById('pageNumberHolder');
    let x=Math.min(totalPage,startPage+9);
    for(let i=startPage-1;i<=x+1;i++)
    {
        let pageNumber=document.createElement('div');
        if(i===startPage-1)
        {
            pageNumber.innerHTML='<<';
            pageNumber.id='prev';
            pageNumber.style.borderTopLeftRadius='5px';
            pageNumber.style.borderBottomLeftRadius='5px';
            pageNumber.addEventListener('click',()=>{
                if(startPage>1)
                {
                    --startPage;
                    pageNumberHolder.removeChild(pageNumberHolder.children[pageNumberHolder.children.length-2]);
                    let newPageNumber=document.createElement('div');
                    newPageNumber.innerHTML=startPage;
                    newPageNumber.id=startPage;
                    addPageNumberEvent(newPageNumber,startPage);
                    addPageNumberStyle(newPageNumber);
                    pageNumberHolder.insertBefore(newPageNumber,pageNumberHolder.children[1]);
                }
            });
        }
        else if(i===x+1)
        {
            pageNumber.innerHTML='>>';
            pageNumber.id='next';
            pageNumber.style.borderTopRightRadius='5px';
            pageNumber.style.borderBottomRightRadius='5px';
            pageNumber.addEventListener('click',()=>{
                if(startPage+10<=totalPage)
                {
                    ++startPage;
                    pageNumberHolder.removeChild(pageNumberHolder.children[1]);
                    let newPageNumber=document.createElement('div');
                    newPageNumber.id=startPage+9;
                    newPageNumber.innerHTML=startPage+9;
                    addPageNumberEvent(newPageNumber,startPage+9);
                    addPageNumberStyle(newPageNumber);
                    pageNumberHolder.insertBefore(newPageNumber,pageNumberHolder.lastChild);
                }
                else
                {
                    toast('No more pages available');
                }
            });
        }
        else
        {
            pageNumber.innerHTML=i;
            pageNumber.id=`${i}`;
            addPageNumberEvent(pageNumber,i);
        }

        addPageNumberStyle(pageNumber);

        pageNumberHolder.appendChild(pageNumber);
    }

    function addPageNumberStyle(pageNumber)
    {
        pageNumber.style.width='10%';
        pageNumber.style.padding='1vw';
        pageNumber.style.display='flex';
        pageNumber.style.alignItems='center';
        pageNumber.style.justifyContent='center';
        pageNumber.style.border='1px solid grey';
        pageNumber.style.cursor='pointer';
        if(parseInt(pageNumber.id)==selectedPage)
        {
            pageNumber.style.backgroundColor='#428bca';
            pageNumber.style.color='white';
        }
        else
            pageNumber.style.color='#428bca';
    }

    function addPageNumberEvent(pageNumber,i)
    {
        pageNumber.addEventListener('click',()=>{
            let contentLoading=document.getElementById('contentLoading');
            if(contentLoading.style.display===""||contentLoading.style.display==="none")
            {
                contentLoading.style.display='flex';
            }
            page=i;
            let oldSelectedPage=document.getElementById(`${selectedPage}`);
            if(oldSelectedPage!==null)
            {
                oldSelectedPage.style.backgroundColor='white';
                oldSelectedPage.style.color='#428bca';
            }
            selectedPage=i;
            let newSelectedPage=document.getElementById(`${selectedPage}`);
            newSelectedPage.style.backgroundColor='#428bca';
            newSelectedPage.style.color='white';
            fetchRepo();
        });

        pageNumber.addEventListener('mouseover',()=>{
            if(selectedPage!==parseInt(pageNumber.id))
            {
                pageNumber.style.backgroundColor='grey';
                pageNumber.style.color='white';
            }
        })

        pageNumber.addEventListener('mouseout',()=>{
            if(selectedPage!==parseInt(pageNumber.id))
            {
                pageNumber.style.backgroundColor='white';
                pageNumber.style.color='#428bca';
            }
        })
    }
}

document.getElementById('searchUserBtn').addEventListener('click',() => {
    callsCompleted=0;
    page=1;
    perPage=10;
    startPage=1;
    selectedPage=1;
    isPaginated=false;
    timer=null;
    document.getElementById('pageLimit').value=10;
    let globalLoading=document.getElementById('globalLoading');
    if(globalLoading.style.display===""||globalLoading.style.display==='none')
    {
        globalLoading.style.display='flex';
    }
    document.getElementById('pageNumberHolder').innerHTML='';
    fetchProfile();
    fetchRepo();
});

document.getElementById('pageLimit').addEventListener('input',()=>{
    if(timer!==null)
        clearTimeout(timer);

    timer=setTimeout(()=>{
        let enteredValue=document.getElementById('pageLimit').value;
        if(enteredValue>=1&&enteredValue<=100)
        {
            let contentLoading=document.getElementById('contentLoading');
            if(contentLoading.style.display===""||contentLoading.style.display==="none")
            {
                contentLoading.style.display='flex';
            }
            selectedPage=1;
            page=1;
            startPage=1;
            perPage=enteredValue;
            isPaginated=false;
            document.getElementById('pageNumberHolder').innerHTML='';
            fetchRepo();
        }
        else if(enteredValue>100)
        {
            toast("Max value of 100 is allowed for number of repositories per page");
        }
        else
        {
            toast("Value for number of repositories per page can not be less than 1");
        }
    },1000);
});

document.getElementById('pageLimit').addEventListener('blur',()=>{
    document.getElementById('pageLimit').value=perPage;
});