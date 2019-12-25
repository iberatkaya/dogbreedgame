import React, { Component } from 'react'


interface State {
   dogs: Array<string>,
   dogImages: Array<string>,
   score: number,
   rounds: number,
   streak: number,
   randomIndeces: Array<number>
}

interface Props{

}

class PlayPage extends Component<Props, State> {


   constructor(props: Props) {
      super(props);
      this.state = {
         dogs: [],
         score: 0,
         rounds: 0,
         streak: 0,
         dogImages: [],
         randomIndeces: []
      }
   }

   async componentDidMount() {
      //Get all dogs from the api
      await this.fetchAllDogs();
      //Select the required number of random numbers
      this.selectRandomNumbers();
      //Fetch the dog images from the api
      await this.fetchDogImages();
   }

   selectRandomNumbers = () => {
      let number = 3;      //Default is 3
      for(let i=0; i<this.state.streak; i+=5){     //For every strike of 5, increase the number by 3
         number +=3;
      }
      let randomIndeces = []
      for(let i=0; i<number; i++){
         let random = Math.round(Math.random() * this.state.dogs.length-1)      //Select a random number between 0 to the last element of the dogs array 
         for(let j=0; j<randomIndeces.length; j++){
            if(randomIndeces[j] === random){    //If the index is the same, do not add it
               i--;
               continue;
            }
         }
         randomIndeces.push(random);
      }
      this.setState({randomIndeces});
   }

   fetchAllDogs = async () => {
      let req = await fetch('https://dog.ceo/api/breeds/list/all');  //Fetch all dogs from the api
      let res = await req.json();      //Get the result's json
      let dogs = res.message;          //Get the message from the api's response which contains the list of the dogs as an object
      dogs = Object.keys(res.message)     //Convert the object's key values into an array since the key values contain the dog names
      this.setState({ dogs })
   }

   fetchDogImages = async () => {
      let randomIndeces = [...this.state.randomIndeces];
      let dogImages: Array<string> = [];
      for(let i=0; i<randomIndeces.length; i++){      //Fetch the dog images using the random indeces
         let req = await fetch('https://dog.ceo/api/breed/' + this.state.dogs[randomIndeces[i]] + '/images/random');
         let res = await req.json();
         let dogImage = res.message;
         dogImages.push(dogImage)
      }
      this.setState({ dogImages })
   }

   printDogImages = (images: Array<string>) => {      //The component to print the dog images
      return (
         <div>{
            images.map((item) => {
               return <img width={240} height={240} src={item} alt="dog" />
            })}
         </div>
      )
   }

   render() {
      return (
         <div>
            {this.printDogImages(this.state.dogImages)}
         </div>
      )
   }
}

export default PlayPage
