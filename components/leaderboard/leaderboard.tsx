import React, { useState, useEffect } from 'react';
import { getAllScores, createScore, updateScore, deleteScore, Score, getTopScoresByCity } from '../../src/app/API'; 
import styles from "./page.module.css";
import { Modal, IconButton, createTheme, useMediaQuery, Skeleton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface LeaderboardProps {
  username: string;
  points: number;
  city: string
  timeEnded: boolean
  reset: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ username, points, city, timeEnded, reset,  }) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [score, setScore] = useState('');
  const [selectedScoreId, setSelectedScoreId] = useState<string | null>(null);
  const [topScores, setTopScores] = useState<Score[]>([]);
  const [filteredTopScores, setFilteredTopScores] = useState<Score[]>([]);
  const [highestScorer, setHighestScorer] = useState<string>('');
  const [highestScore, setHighestScore] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false)
  const [userRank, setUserRank] = useState<number | null>(null);
  const [scoreAdded, setScoreAdded] = useState(false);
  const [scoreLoading, setScoreLoading] = useState<boolean>(true)
  const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(true)
  const [scoresFetched, setScoresFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchScores = async () => {
      if (!scoresFetched) {
      try {
        // setScoreLoading(true)
        const allScores = await getAllScores();
    
        // Sort scores by points first, then by time added (more recent first)
        const sortedScores = allScores.sort((a, b) => {
          if (a.points !== b.points) {
            return b.points - a.points; // Sort by points (higher to lower)
          } else {
            // If points are tied, sort by time added (more recent first)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
        });
    
        setScores(sortedScores);
    
        // Filter scores by city (if needed)
        const cityScores = sortedScores.filter((score) => score.city === city);
    
        // Find the highest score in the selected city
        if (cityScores.length > 0) {
          const highestScoreObj = cityScores[0]; // First score will be the highest
          setHighestScorer(highestScoreObj.username);
          setHighestScore(highestScoreObj.points);
        }
    
        // Update topScores with the top 5 sorted scores
        const top5Scores = sortedScores.slice(0, 5);
        setTopScores(top5Scores);
        // setScoreLoading(false)
        setScoresFetched(true);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    }
    };
  
    fetchScores();
  }, [city, scores]); // Empty dependency array means this effect runs once on component mount

  // const handleAddScore = async () => {
  //   try {
  //     const newScore = await createScore({ username: username, points: points, city: city });
  
  //     if (newScore) {
  //       // Update state with the new score (including _id)
  //       setScores((prevScores) => [...prevScores, newScore]);
  //     } else {
  //       console.error('Failed to add score: received invalid response from server');
  //     }
  //   } catch (error) {
  //     console.error('Error adding score:', error);
  //   }
  // };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const handleTimerExpired = async () => {
      if (timeEnded && !scoreAdded && !scoresFetched) {
        // Clear any previous timer
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        // Delay the execution of score addition logic by 300 milliseconds
        timer = setTimeout(async () => {
          try {
            const newScore = await createScore({ username: username, points: points, city: city });
            if (newScore) {
              setScores((prevScores) => [...prevScores, newScore]);
              updateHighestScorer();
              setScoreAdded(true);
            } else {
              console.error('Failed to add score: received invalid response from server');
            }
          } catch (error) {
            console.error('Error adding score:', error);
          }
        }, 300); // Adjust the delay as needed
        setScoresFetched(true);
      }
    };

    handleTimerExpired();

    return () => {
      // Cleanup function to clear timer if component unmounts or `timeEnded` changes
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
  }, [timeEnded, username, points, city, scoreAdded]);

  const updateHighestScorer = () => {
    const cityScores = scores.filter((score) => score.city === city);
    const sortedCityScores = cityScores.sort((a, b) => b.points - a.points);
  
    if (sortedCityScores.length > 0) {
      const highestScoreObj = sortedCityScores[0];
      setHighestScorer(highestScoreObj.username);
      setHighestScore(highestScoreObj.points);
    }
  };

  const handleUpdateScore = async () => {
    if (!selectedScoreId) return;
  
    try {
      const updatedScore = await updateScore(selectedScoreId, { username: username, points: points, city: city });
      setScores((prevScores) =>
        prevScores.map((score) => (score._id === selectedScoreId ? updatedScore : score))
      ); // Update state using functional update
      setSelectedScoreId(null); // Reset selected score ID
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const handleDeleteScore = async (scoreId: string) => {
    try {
      await deleteScore(scoreId);
      const updatedScores = scores.filter((score) => score._id !== scoreId);
      setScores(updatedScores);
    } catch (error) {
      console.error('Error deleting score:', error);
    }
  };

  const handleFetchTopCityScores = async () => {
    try {
      const cityScores = topScores.filter((score) => score.city === city);
      const sortedCityScores = cityScores.sort((a, b) => b.points - a.points).slice(0, 5);
      setFilteredTopScores(sortedCityScores);
    } catch (error) {
      console.error('Error fetching top city scores:', error);
    }
  };

  const handleShowTopScoresModal = async () => {
  try {
    // Fetch all scores
    setScoreLoading(true)
    const allScores = await getAllScores();

    const cityScores = allScores.filter((score) => score.city === city);

    // Include the user's most recent score in the sorted scores array
    const sortedScores = [...cityScores, { _id: '', username, points, city, createdAt: new Date().toISOString() }]
      .filter((item): item is Score => '_id' in item);

    // Sort the scores
    sortedScores.sort((a, b) => {
      if (a.points !== b.points) {
        return b.points - a.points; // Sort by points (higher to lower)
      } else {
        // If points are tied, sort by time added (more recent first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    // Find user's score
    // const userScore = sortedScores.find((score) => score.username === username)?.points;
    const userScore = points

    if (userScore !== undefined && userScore >= 0) {
      // Calculate user's rank within all sorted scores
      const userRank = sortedScores.findIndex((score) => score.username === username && score.points === userScore) + 1;

      if (userScore === 0) {
        // If user got 0 points, adjust the user rank considering other players with 0 points
        const zeroPointsPlayersCount = sortedScores.filter((score) => score.points === 0).length;
        setUserRank(zeroPointsPlayersCount + 1); // Adding 1 to get the correct rank including the current user
        setTopScores(sortedScores.slice(0, 5)); // Set top 5 scores
      } else {
        setTopScores(sortedScores.slice(0, 5)); // Set top 5 scores
        setUserRank(userRank); // Assign user's rank based on sorted scores
      }
    }
    setScoreLoading(false)
  } catch (error) {
    console.error('Error fetching top city scores:', error);
  }
};

  
  
  
  useEffect(() => {
    if (scoreAdded) {
      // Call the function to fetch and display the user's rank
      handleShowTopScoresModal();
    }
  }, [scoreAdded]);
  
  const handleClick = () => {
    setOpenModal(true)
    handleShowTopScoresModal()
  }

  const handleClose = () => {
    setOpenModal(false)
    // setUserRank(null);
    // setScoreAdded(false)
  }

  const handleTryAgain = () => {
    reset();
    setUserRank(null); // Reset userRank when starting a new game
    setScoreAdded(false)
  };

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 767,
        md: 1024,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const getTextSize = () => { // Default width for computer
    if (isMobile) {
      return "14px";
    } else if (isTablet) {
      return "18px"; // Adjust width for tablet
    } else {
      return "22px"
    }
  }

  const getTrophySize = () => { // Default width for computer
    if (isMobile) {
      return "14px";
    } else if (isTablet) {
      return "18px"; // Adjust width for tablet
    } else {
      return "22px"
    }
  }

  const getModalWidth = () => { // Default width for computer
    if (isMobile) {
      return "80%";
    } else if (isTablet) {
      return "60%"; // Adjust width for tablet
    } else {
      return "60%"
    }
  }

  const getHeaderSize= () => { // Default width for computer
    if (isMobile) {
      return "18px";
    } else if (isTablet) {
      return "20px"; // Adjust width for tablet
    } else {
      return "22px"
    }
  }

  const getCitySize = () => { // Default width for computer
    if (isMobile) {
      return "16px";
    } else if (isTablet) {
      return "18px"; // Adjust width for tablet
    } else {
      return "20px"
    }
  }

  const getScoresSize = () => { // Default width for computer
    if (isMobile) {
      return "14px";
    } else if (isTablet) {
      return "20px"; // Adjust width for tablet
    } else {
      return "26px"
    }
  }
  return (
    <div>
      <div className={styles.container}>
        {scoreLoading ? (
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Skeleton animation="wave" width={100} height={20} />
          </div>
        ) : (
          
            <div className={styles.text2} style={{fontSize: getTextSize()}}>You ranked #{userRank}</div>
          )}
            <button 
              className={styles.button}
              onClick={handleClick}
            >HIGH SCORES</button>
      </div>
      
      {openModal && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          disableAutoFocus={true} 
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          {scoreLoading ? (
          <div>
            <Skeleton animation="wave" width={200} height={20} />
            <Skeleton animation="wave" width={150} height={20} />
          </div>
        ) : (
          <div className={styles.modal} style={{width: getModalWidth()}}>
            <div className={styles.closeButton}>
              <IconButton aria-label="close" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className={styles.modalContainer}>
              <div className={styles.header} style={{fontSize: getHeaderSize()}}>HIGH SCORES</div>
              <div className={styles.city} style={{fontSize: getCitySize()}}>🗺️ {city}</div>
              <div className={styles.header} style={{fontSize: getHeaderSize()}}>YOU RANKED #{userRank}</div>
              <div className={styles.scores} style={{fontSize: getScoresSize()}}>
                <div className={styles.medals}>
                  <span className={styles.medal}>🥇</span>
                  <span className={styles.medal}>🥈</span>
                  <span className={styles.medal}>🥉</span>
                  <span className={styles.medalHidden}>🥉</span>
                  <span className={styles.medalHidden}>🥉</span>
                </div>
                <div>
                {topScores.map((score: Score, index: number) => (
                   index < 5 && (
                <div key={score._id} className={styles.scoreItem} >
                  <span className={styles.username}>
                    {score.username}
                  </span>
                  <span className={styles.points}>
                    {score.points} POINTS
                  </span>
                </div>
                   )
                ))}
                </div>
              </div>
                <button 
                  className={styles.button2}
                  onClick={handleTryAgain}
                >TRY AGAIN</button>
              </div>
          </div>
        )}
        </Modal>  
      )}
    </div>
  );
};

export default Leaderboard;
