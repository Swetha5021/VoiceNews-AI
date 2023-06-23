import React, {useState,useEffect} from 'react';
import { Typography } from '@material-ui/core'; 
import wordsToNumbers from 'words-to-numbers';
import alanBtn from '@alan-ai/alan-sdk-web';

import logo from './images/logo.png';
import { NewsCards} from './components';
import useStyles from './styles';



const App = () => {
    const [activeArticle, setActiveArticle] = useState(0);
    const [newsArticles, setNewsArticles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
  
    const classes = useStyles();
  
    useEffect(() => {
      alanBtn({
        key: '636ad19c63f1400682849ebd171e34522e956eca572e1d8b807a3e2338fdd0dc/stage',
        onCommand: ({ command, articles, number }) => {
          if (command === 'newHeadlines') {
            setNewsArticles(articles);
            setActiveArticle(-1);
          } else if (command === 'instructions') {
            setIsOpen(true);
          } else if (command === 'highlight') {
            setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
          } else if (command === 'open') {
            const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
            const article = articles[parsedNumber - 1];
  
            if (parsedNumber > articles.length) {
              alanBtn().playText('Please try that again...');
            } else if (article) {
              window.open(article.url, '_blank');
              alanBtn().playText('Opening...');
            } else {
              alanBtn().playText('Please try that again...');
            }
          }
        },
      });
    }, []);
  
    return (
      <div>
        <div className={classes.logoContainer}>
          {newsArticles.length ? (
            <div className={classes.infoContainer}>
              <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [4]</Typography></div>
              <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
            </div>
          ) : null}
          <img src="https://scontent-maa2-1.xx.fbcdn.net/v/t39.30808-6/310681473_781698249884788_5413193905708005780_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=-0-xhHplwYIAX_LGUBz&_nc_ht=scontent-maa2-1.xx&oh=00_AfBiLRlPmZXsx8AGabSQlOnimBEMEUt-0-0BtPXr4VABXg&oe=6498BB57" className={classes.alanLogo} alt="logo" />
        </div>
        <NewsCards articles={newsArticles} activeArticle={activeArticle} />
        
      </div>
    );
  };
  
  export default App;