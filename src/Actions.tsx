
export interface HighScore {
   score: number
}
 
export const setHighScore = (key: number) => (
     {
       type: 'SET_HIGHSCORE',
       payload: key
     }
 );
