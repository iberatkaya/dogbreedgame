import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';


interface State {
   dogs: Array<string>,
   dogImages: Array<string>,
   score: number,
   rounds: number,
   streak: number,
   randomIndeces: Array<number>,
   borderColors: Array<string>,
   selectedDogIndex: number,
   selected: boolean
}

interface Props {

}

class PlayPage extends Component<Props, State> {


   constructor(props: Props) {
      super(props);
      this.state = {
         dogs: [],
         selectedDogIndex: 0,
         selected: false,
         score: 0,
         rounds: 0,
         streak: 0,
         borderColors: [],
         dogImages: [],
         randomIndeces: []
      }
   }

   async componentDidMount() {
      //Get all dogs from the api
      await this.fetchAllDogs();
      //Select the required number of random numbers
      let randomnumbers = this.selectRandomNumbers();
      //Fetch the dog images from the api
      await this.fetchDogImages(randomnumbers.randomIndeces, randomnumbers.selectedDogIndex);
   }

   selectRandomNumbers = () => {
      let number = 3;      //Default is 3
      let streak = this.state.streak;
      while (streak >= 5 && streak % 5 >= 0) {
         number += 3;
         streak -= 5;
      }
      let randomIndeces = []
      for (let i = 0; i < number; i++) {
         let random = Math.floor(Math.random() * this.state.dogs.length);      //Select a random number between 0 to the last element of the dogs array 
         let push = true;
         if (random >= this.state.dogs.length) {    //If the index exceeds the arrays length, reiterate
            i--;
            push = false;
         }
         for (let j = 0; j < randomIndeces.length; j++) {
            if (randomIndeces[j] === random || random >= this.state.dogs.length) {    //If the index is the same, do not add it
               i--;
               push = false;
            }
         }
         if (push)
            randomIndeces.push(random);
      }
      let selectedDogIndex = Math.floor(Math.random() * randomIndeces.length);
      return { randomIndeces, selectedDogIndex };
   }

   fetchAllDogs = async () => {
      let req = await fetch('https://dog.ceo/api/breeds/list/all');  //Fetch all dogs from the api
      let res = await req.json();      //Get the result's json
      let dogs = res.message;          //Get the message from the api's response which contains the list of the dogs as an object
      dogs = Object.keys(res.message)     //Convert the object's key values into an array since the key values contain the dog names
      this.setState({ dogs })
   }

   fetchDogImages = async (randomIndeces: Array<number>, selectedDogIndex: number) => {
      let dogImages: Array<string> = [];
      let borderColors: Array<string> = [];
      for (let i = 0; i < randomIndeces.length; i++) {      //Fetch the dog images using the random indeces
         let req = await fetch('https://dog.ceo/api/breed/' + this.state.dogs[randomIndeces[i]] + '/images/random');
         let res = await req.json();
         let dogImage = res.message;
         dogImages.push(dogImage)
         borderColors.push('');
      }
      let selected = false;
      this.setState({ dogImages, borderColors, selected, selectedDogIndex })
   }

   printDogImages = (images: Array<string>) => {      //The component to print the dog images
      return (
         <Row >{
            images.map((item, index) => {
               return (
                  <Col key={index.toString()} md={4} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                     <img onClick={() => {
                        if (!this.state.selected) {
                           let rounds = this.state.rounds + 1;    //Update rounds played
                           if (this.state.selectedDogIndex === index) {         //If answer if correct
                              let borderColors = [...this.state.borderColors];
                              borderColors[index] = '#00ff00';       //Make selected image's border green
                              let selected = true;             //Stop user from selecting another image
                              let score = this.state.score + 1;    //Update score
                              let streak = this.state.streak + 1;
                              this.setState({ borderColors, selected, rounds, score, streak })
                           }
                           else {
                              let borderColors = [...this.state.borderColors];
                              borderColors[index] = '#ff0000';       //Make selected image's border red
                              borderColors[this.state.selectedDogIndex] = '#00ff00';   //Make selected image's border green
                              let selected = true;          //Stop user from selecting another image
                              let streak = 0;
                              this.setState({ borderColors, selected, rounds, streak })
                           }
                        }
                     }} className="img-responsive" width={200} height={200} src={item} alt="dog" style={this.state.borderColors[index] === '' ? {} : { borderWidth: 6, borderRadius: 12, borderStyle: 'solid', borderColor: this.state.borderColors[index] }} />
                     {/*index === this.state.selectedDogIndex ? <p>Selected</p> : <></>*/}
                  </Col>
               )
            })}
         </Row>
      )
   }

   printScore = () => {
      return (
         <Col>
            <Row className="justify-content-center">
               <h6 style={{ textAlign: 'center' }}>
                  Score: {this.state.score}
               </h6>
            </Row>
            <Row className="justify-content-center">
               <h6 style={{ textAlign: 'center' }}>
                  Streak: {this.state.streak}
               </h6>
            </Row>
            <Row className="justify-content-center">
               <h6>
                  Accuracy: {this.state.rounds === 0 ? 0 : this.state.score / this.state.rounds * 100}%
               </h6>
            </Row>
         </Col>
      );
   }

   continue = () => {
      return (
         <Row style={{ marginBottom: '1rem' }}>
            <Col style={{ textAlign: 'center' }}>
               <Button onClick={async () => {
                  //Select the required number of random numbers
                  let randomnumbers = this.selectRandomNumbers();
                  //Fetch the dog images from the api
                  await this.fetchDogImages(randomnumbers.randomIndeces, randomnumbers.selectedDogIndex);
               }}>Continue</Button>
            </Col>
         </Row>
      )
   }

   render() {
      return (
         <Container>
            {this.printScore()}
            {this.state.selected ? this.continue() : <></>}
            {this.printDogImages(this.state.dogImages)}
         </Container>
      )
   }
}

export default PlayPage
