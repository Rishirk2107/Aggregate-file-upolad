const button1=document.getElementById("button1");
    const button2=document.getElementById("button2");
    const content1 = document.getElementById('content1');
    const content2 = document.getElementById('content2');

    button1.addEventListener('click',()=>{
        content1.style.display = 'block';
        content2.style.display = 'none';
        fetch('/userstatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({message:1}),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);
        const userListElement = document.getElementById('userList1');
      userListElement.innerHTML = ''; // Clear existing content

      data.forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = user.username;
        userListElement.appendChild(listItem);
      });
      })
      .catch(error => console.error('Error sending data:', error));

    });

    button2.addEventListener('click',()=>{
        content2.style.display = 'block';
        content1.style.display = 'none';
        fetch('/userstatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({message:2}),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);
        const userListElement = document.getElementById('userList2');
      userListElement.innerHTML = ''; // lear existing content

      data.forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = user.username;
        userListElement.appendChild(listItem);
      });
      })
      .catch(error => console.error('Error sending data:', error));

    });