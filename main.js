console.log("Javascript School Project");

let studentFirstName = document.querySelector("#firstName");
let studentLastName = document.querySelector("#lastName");
let studentAge = document.querySelector("#studentAge");

let sortFirstNameBtn = document.querySelector("#sortByFirstName");
  let sortLastNameBtn = document.querySelector("#sortByLastName");
  let sortAgeBtn = document.querySelector("#sortByAge");

let allLists = document.querySelectorAll("li");

//asynch function to fetch data

async function fetchData(URL) {
  let response = await fetch(URL);
  let data = await response.json();
  return data;
}

//async function to call the above function and start using the data

async function renderData() {
  let students = await fetchData("https://api.mocki.io/v2/01047e91/students");
  let schools = await fetchData("https://api.mocki.io/v2/01047e91/schools");

  //Creating a list of students by calling the function studentDataDisplay

  studentDataDisplay(students);

  let ascending = false;

  //sorting the list  
  sortFirstNameBtn.addEventListener("click", () => {          
    console.log("first name sort clicked");
    let array = sortingArray(students, "firstName", ascending);
    studentDataDisplay(array);
    ascending = !ascending;
  });

  sortLastNameBtn.addEventListener("click", () => {        
    console.log("Last name sort clicked");
    let array = sortingArray(students, "lastName", ascending);
    studentDataDisplay(array);
    ascending = !ascending;
  });

  sortAgeBtn.addEventListener("click", () => {    
    console.log("age clicked");
    let array = sortingArray(students, "age", ascending);
    studentDataDisplay(array);
    ascending = !ascending;
  });
  console.log(students);
}
renderData();

//_____Functions_____

//Function to display the student list on DOM

let studentDataDisplay = (array) => {
    let studentFirstNameUl = document.createElement("ul");
    studentFirstName.appendChild(studentFirstNameUl);
  
    let studentLastNameUl = document.createElement("ul");
    studentLastName.appendChild(studentLastNameUl);
  
    let studentAgeUl = document.createElement("ul");
    studentAge.appendChild(studentAgeUl);
  
    array.forEach((student) => {
      let studentFirstNameList = document.createElement("li");
      studentFirstNameList.textContent = student.firstName;
      studentFirstNameList.style.listStyle = "none";
      studentFirstNameUl.appendChild(studentFirstNameList);
  
      let studentLastNameList = document.createElement("li");
      studentLastNameList.textContent = student.lastName;
      studentLastNameList.style.listStyle = "none";
      studentLastNameUl.appendChild(studentLastNameList);
  
      let studentAgeList = document.createElement("li");
      studentAgeList.innerHTML = student.age;
      studentAgeList.style.listStyle = "none";
      studentAgeUl.appendChild(studentAgeList);
    });
  };

// Function to sort ascending and descending

let sortingArray = (array, sortBy, ascending) => {
     array.sort(function (a, b) {
    if (a[sortBy] > b[sortBy]) return 1;
    if (a[sortBy] < b[sortBy]) return -1;
    return 0;
  });
  if (ascending) array.reverse();
  return array;
};



