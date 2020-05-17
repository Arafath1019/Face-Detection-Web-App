import React, {Component} from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Register from './components/Register/Register.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import SignIn from './components/Signin/Signin.js';
import './App.css';


//Clarifai API Section-start
const app = new Clarifai.App({
 apiKey: '317668be6b9645f6a72df2aad20c87df'
});

//Clarifai api section-end


//npm-ParticleJs modification const object
const particlesOptions = {
         particles: {
          number: {
           value: 150,
             density:{
               enable: true,
               value_area: 800
              }
            }
          }
        };


//initial state
const initialState = {
      input:'',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        entries: '',
        joined: ''
      }
    };
        

//starting App Component
class App extends Component{

  //constructor function
  constructor(){
    super();
    //App state
    this.state= initialState;
  }

  loadUser = (data) =>{
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.name,
        password: data.password,
        entries: data.entries,
        joined: data.joined
      }
    })
  }



  //calculating face location

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }


  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  //Input Field Handler
  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  //Submit button handler
  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input});
    //Face Detection model
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
   .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
   .catch(err => console.log(err))
  }

  onRouteChange = (route) =>{
    if(route === 'signin'){
      this.setState(initialState)
    }else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){
  return (
    <div className="App">
      <Particles className='particles' 
              params={particlesOptions}
            />
     <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
     {
       this.state.route === 'home'
        ? <div>
          <Logo />
          <Rank 
            name={this.state.user.name}
            entries={this.state.user.entries}
          />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
        </div>
        
        :(
          this.state.route === 'signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
     }
    </div>
  );
    }
}

export default App;
