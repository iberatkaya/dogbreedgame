import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { GlobalHotKeys } from 'react-hotkeys';
import { HighScore, setHighScore } from './Actions';


interface State {
   dogs: Array<string>,
   dogImages: Array<string>,
   score: number,
   rounds: number,
   streak: number,
   rows: number,
   loading: boolean,
   randomIndeces: Array<number>,
   borderColors: Array<string>,
   selectedBreedName: string,
   showContinue: boolean,
   selectedDogIndex: number,
   selected: boolean
}

interface Props {
   highscore: { score: number },
   setHighScore: (arg: number) => void
}

interface LooseObject {
   [key: string]: any
}

const keyMap: LooseObject = {        //Total hotkeys available
   continue: "enter",
   select1: "1",
   select2: "2",
   select3: "3",
   select4: "4",
   select5: "5",
   select6: "6",
   select7: "7",
   select8: "8",
   select9: "9",
   select10: "0",
   select11: "q",
   select12: "w",
   select13: "e",
   select14: "r",
   select15: "t",
   select16: "y",
   select17: "u",
   select18: "i",
   select19: "o",
   select20: "p",
   select21: "a"
};

class PlayPage extends Component<Props, State> {


   constructor(props: Props) {
      super(props);
      this.state = {
         dogs: [],
         selectedDogIndex: 0,
         selected: false,
         score: 0,
         rows: 0,
         loading: true,
         rounds: 0,
         streak: 0,
         selectedBreedName: '',
         showContinue: false,
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
      await this.fetchDogImages(randomnumbers.randomIndeces);
   }

   selectRandomNumbers = () => {
      let number = 3 + this.state.rows * 3;
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
      return { randomIndeces };
   }

   fetchAllDogs = async () => {
      let req = await fetch('https://dog.ceo/api/breeds/list/all');  //Fetch all dogs from the api
      let res = await req.json();      //Get the result's json
      let dogs = res.message;          //Get the message from the api's response which contains the list of the dogs as an object
      dogs = Object.keys(res.message)     //Convert the object's key values into an array since the key values contain the dog names
      this.setState({ dogs })
   }

   fetchDogImages = async (randomIndeces: Array<number>) => {
      let dogImages: Array<string> = [];
      let borderColors: Array<string> = [];
      for (let i = 0; i < randomIndeces.length; i++) {      //Fetch the dog images using the random indeces
         let req = await fetch('https://dog.ceo/api/breed/' + this.state.dogs[randomIndeces[i]] + '/images/random');
         let res = await req.json();
         let dogImage = res.message;
         dogImages.push(dogImage)
         borderColors.push('');
      }
      let selectedDogIndex = Math.floor(Math.random() * randomIndeces.length);
      let selectedBreedName = this.state.dogs[randomIndeces[selectedDogIndex]];
      let showContinue = false;     //Do not show the continue button while loading
      this.setState({ dogImages, borderColors, selectedDogIndex, selectedBreedName, showContinue })
   }

   printDogImages = (images: Array<string>) => {      //The component to print the dog images
      return (
         <Row >{
            images.map((item, index) => {
               return (
                  <Col key={index.toString()} md={4} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                     <img
                        onLoad={() => {
                           let loading = false;
                           this.setState({ loading });
                        }}
                        onClick={() => {
                           this.selectImage(index);
                        }} className="img-responsive" width={200} height={200} src={item} alt="dog" style={this.state.borderColors[index] === '' ? { cursor: 'pointer' } : { borderWidth: 6, borderRadius: 12, borderStyle: 'solid', borderColor: this.state.borderColors[index] }} />
                     {/*index === this.state.selectedDogIndex ? <p>Selected</p> : <></>*/}
                  </Col>
               )
            })}
         </Row>
      )
   }

   selectImage = (index: number) => {
      if (index > this.state.dogImages.length)
         return;
      if (!this.state.selected) {
         let rounds = this.state.rounds + 1;    //Update rounds played
         if (this.state.selectedDogIndex === index) {         //If answer if correct
            let borderColors = [...this.state.borderColors];
            borderColors[index] = '#00ff00';       //Make selected image's border green
            let selected = true;             //Stop user from selecting another image
            let score = this.state.score + 1;    //Update score
            let streak = this.state.streak + 1;
            let highscore = this.props.highscore.score;
            if (highscore < score)
               this.props.setHighScore(score);
            let rows = this.state.rows;
            if (streak % 5 === 0) {
               rows++;
            }
            this.setState({ borderColors, selected, rounds, score, streak, rows }, () => {
               setTimeout(() => {
                  this.continue();
               }, 1000)
            })
         }
         else {
            let borderColors = [...this.state.borderColors];
            borderColors[index] = '#ff0000';       //Make selected image's border red
            borderColors[this.state.selectedDogIndex] = '#00ff00';   //Make selected image's border green
            let selected = true;          //Stop user from selecting another image
            let streak = 0;
            let showContinue = true;
            this.setState({ borderColors, selected, rounds, streak, showContinue })
         }
      }
   }

   printScore = () => {
      return (
         <Col className="mb-2">
            <Row className="justify-content-center">
               <h6 style={{ marginRight: '1rem' }}>
                  Score: {this.state.score}
               </h6>
               <h6>
                  Streak: {this.state.streak}
               </h6>
            </Row>
            <Row className="justify-content-center">
            </Row>
            <Row className="justify-content-center">
               <h6>
                  Accuracy: {this.state.rounds === 0 ? 0 : (this.state.score / this.state.rounds * 100).toFixed(0)}%
               </h6>
            </Row>
            {this.state.loading ?
               <></>
               :
               <>
                  <Row className="justify-content-center">
                     <h6>
                        Breed: {this.state.selectedBreedName[0].toUpperCase() + this.state.selectedBreedName.substring(1)}
                     </h6>
                  </Row>
                  <Row className="justify-content-center">
                     <p style={{ fontSize: '1.2rem' }} className="lead">
                        {this.help()}
                     </p>
                  </Row>
               </>
            }
         </Col>
      );
   }

   continue = () => {
      this.setState({ loading: true, selected: false, dogImages: [] }, async () => {
         //Select the required number of random numbers
         let randomnumbers = this.selectRandomNumbers();
         //Fetch the dog images from the api
         await this.fetchDogImages(randomnumbers.randomIndeces);
      });
   }

   continueButton = () => {
      return (
         <Row style={{ marginBottom: '2rem' }}>
            <Col style={{ textAlign: 'center' }}>
               <Button onClick={() => {
                  this.continue()
               }}>Continue</Button>
            </Col>
         </Row>
      )
   }


   handlers = () => {            //Dynamically create the hotkey handlers 
      let obj: LooseObject = {
         continue: () => {
            if(this.state.selected)
               this.continue()
         }
      };
      for (let i = 1; i <= Object.entries(keyMap).length; i++) {
         obj["select" + (i).toString()] = () => this.selectImage(i - 1);
      }
      return obj;
   }

   help = () => {
      let str = "Press ";
      for (let i = 1; i <= this.state.dogImages.length; i++) {
         str += keyMap["select" + i.toString()] + (i !== this.state.dogImages.length ? ", " : "");
      }
      str += " to use hotkeys";
      return str;
   }

   render() {
      return (
         <Container>
            <GlobalHotKeys keyMap={keyMap} handlers={this.handlers()} />
            {this.printScore()}
            {this.state.showContinue && !this.state.loading ? this.continueButton() : <></>}
            {
               this.state.loading ?
                  <Container className="text-center">
                     <Spinner animation="border" />
                  </Container>
                  :
                  <></>
            }
            {this.printDogImages(this.state.dogImages)}
         </Container>
      )
   }
}

interface StateRedux {
   highscore: HighScore
}

const mapStateToProps = (state: StateRedux) => {
   const { highscore } = state;
   return { highscore };
};

const mapDispatchToProps = (dispatch: any) => (
   bindActionCreators({
      setHighScore
   }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(PlayPage);