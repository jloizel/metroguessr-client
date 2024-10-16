import React, { useState, useEffect, useRef } from 'react';
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
  const [userScore, setUserScore] = useState<Score | null>(null);
  const timerExpiredRef = useRef(false);

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
        // setTopScores(top5Scores);
        // setScoreLoading(false)
        setScoresFetched(true);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    }
    };
  
    fetchScores();
  }, [scores]); 
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
  
    const handleTimerExpired = async () => {
      if (timeEnded && !scoreAdded && !scoresFetched) {
        // Clear any previous timer
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
  
        try {
          // Find if the user already has a score
          if (userScore) {
            // Update existing score
            const updatedScore = await updateScore(userScore._id, {
              username: username,
              points: points,
              city: city,
            });
            setScores((prevScores) =>
              prevScores.map((score) =>
                score._id === userScore._id ? updatedScore : score
              )
            );
          } else {
            // Add new score
            const newScore = await createScore({
              username: username,
              points: points,
              city: city,
            });
            setScores((prevScores) => [...prevScores, newScore]);
          }
  
          // Update highest scorer
          updateHighestScorer();
        } catch (error) {
          console.error('Error adding or updating score:', error);
        }
  
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
  }, [timeEnded, scoreAdded, scoresFetched, userScore, username, points, city]);

  const updateHighestScorer = () => {
    const cityScores = scores.filter((score) => score.city === city);
    const sortedScores = cityScores
      .filter((score) => score._id) // Filter out entries with empty _id
      .concat({ _id: '', username, points, city, createdAt: new Date().toISOString() }) // Add the user's score
      .sort((a, b) => {
        if (a.points !== b.points) {
          return b.points - a.points;
        } else {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

    if (sortedScores.length > 0) {
      const highestScoreObj = sortedScores[0];
      setHighestScorer(highestScoreObj.username);
      setHighestScore(highestScoreObj.points);
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
      .filter((item): item is Score => '_id' in item && item._id !== '');

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
      const userRank = sortedScores.findIndex((score) => score.username === username && score.points === userScore) + 1;
    
      if (userScore === 0) {
        const totalPlayersCount = sortedScores.length;
        setUserRank(totalPlayersCount);
        setTopScores(sortedScores.slice(0, 5));
      } else {
        setTopScores(sortedScores.slice(0, 5));
        setUserRank(userRank);
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
      setScoreAdded(true)
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
    setUserRank(null); 
    setScoreAdded(false)
  };


  return (
    <div>
      <div className={styles.container}>
        {scoreLoading ? (
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Skeleton animation="wave" width={100} height={20} />
          </div>
        ) : (
          
          <div className={styles.text2}>
            You ranked #{userRank}
          </div>
        )}
          <button className={styles.button} onClick={handleClick}>
            HIGH SCORES
          </button>
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
          <div className={styles.skeletonContainer}>
            {/* <Skeleton animation="wave" width={200} height={20} />
            <Skeleton animation="wave" width={150} height={20} /> */}
          </div>
        ) : (
          <div className={styles.modal}>
            <div className={styles.closeButton}>
              <IconButton aria-label="close" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className={styles.modalContainer}>
              <div className={styles.header}>HIGH SCORES</div>
              <div className={styles.city}>🗺️ {city}</div>
              <div className={styles.header}>YOU RANKED #{userRank}</div>
              <div className={styles.scores}>
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
                <button className={styles.button2} onClick={handleTryAgain}>
                  TRY AGAIN
                </button>
              </div>
          </div>
        )}
        </Modal>  
      )}
    </div>
  );
};

export default Leaderboard;
