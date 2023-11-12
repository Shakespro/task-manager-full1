import React, { Component } from 'react';
import Modal from './components/Modal';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false
    },
    taskList: []   
  };
}

componentDidMount() {
  this.refreshList();
}

refreshList = () => {
  axios
    .get("http://localhost:8000/api/tasks/")
    .then(res => this.setState({ taskList: res.data }))
    .catch(err => console.log(err));
};

displayCompleted = status => {
  
  if (status) {
    return this.setState({ viewCompleted: true });
  }
  return this.setState({ viewCompleted: false });
};

renderTabList = () => {
  return (
    <div className="my-5 tab-list">
      <span
        onClick={() => this.displayCompleted(true)}
        className={this.state.viewCompleted ? "active" : ""}
      >
        Completed
      </span>
      <span
        onClick={() => this.displayCompleted(false)}
        className={this.state.viewCompleted ? "" : "active"}
      >
        Incomplete
      </span>
    </div>
  );
};

// REndering items in the list ( compl || incopmlete )
renderItems = () => {
  const{ viewCompleted } = this.state;
  const newItems = this.state.taskList.filter(
    item => item.completed == viewCompleted
  );

return newItems.map(item => (
  <li
    key={item.id}
    className="list-group-item d-flex justify-content-between 
    align-items-center">
    <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : "" }`}
      title={item.title}>
      {item.title}
    </span>
    <span>
      <button  onClick={() => this.editItem(item)} className="btn btn-info mr-2"> Edit </button>
      <button onClick={() => this.handleDelete(item)} className="btn btn-danger mr-2">Delete</button>
    </span>
  </li>
  ));
};  


//create toggle property
toggle = () => {
  this.setState({ modal: !this.state.modal });
};

handleSubmit = item => {
  this.toggle();
  if (item.id) {
    axios
      .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
      .then(res => this.refreshList());
  }
  axios
  .post("http://localhost:8000/api/tasks/", item)
  .then(res => this.refreshList());
};

handleDelete = item => {
  axios
  .delete(`http://localhost:8000/api/tasks/${item.id}/`, item)
  .then(res => this.refreshList());
};

createItem = () => {
  const item = { title: "", description: "", completed: false };
  this.setState({ activeItem: item, modal: !this.state.modal });
};

editItem = item => {
  this.setState({ activeItem: item, modal: !this.state.modal });
};



render() {
  return ( 
    <main className="content p-3 mb-2 bg-danger">
      <h1 className="text-white text-uppercase text-center my-4" id="finese">Titan Task Manager</h1>
      <div className="center">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="center">
              <button onClick={this.createItem} className="btn btn-primary">Add task</button>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFAdnvHXXiw1c4Bx7dflm76JJheOBq03_Alw&usqp=CAU" width="10%"/>
            </div>
            <div className="center">
            {this.renderTabList()}
            </div>
            <ul className="list-group list-group-flush">
              {this.renderItems()}
  
            </ul>
          </div>
        </div>
      </div>
      <footer className="my-5 mb-2 bg-danger text-white text-center">Sakhile Design Titans Copyright 
      2023 &copy; All rights reserved</footer>
      {this.state.modal ? (
        <Modal
          activeItem={this.state.activeItem}
          toggle={this.toggle}
          onSave={this.handleSubmit}
        />
      ) : null}
    </main>
  )
}};

export default App;
