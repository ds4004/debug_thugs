
import { useState } from 'react';
import ReactPlayer from 'react-player';

const videos = [
    { id: 1, title: 'Introduction', url: 'https://www.youtube.com/watch?v=JPV-vboWfhY&list=PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi&index=1' },
    { id: 2, title: 'Alphabets', url: 'https://www.youtube.com/watch?v=qcdivQfA41Y&list=PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi&index=2' },
    { id: 3, title: 'Numbers', url: 'https://www.youtube.com/watch?v=JPV-vboWfhY&list=PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi&index=3' },
    { id: 4, title: 'Basic words level-1', url: 'https://www.youtube.com/watch?v=qcdivQfA41Y&list=PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi&index=4' },
    { id: 5, title: 'Basic words level-2', url: 'https://www.youtube.com/watch?v=JPV-vboWfhY&list=PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi&index=5' },
    { id: 6, title: 'colors', url: 'https://www.youtube.com/watch?v=qcdivQfA41Y&list=PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi&index=6' },
    { id: 7, title: 'Months', url: 'https://www.youtube.com/watch?v=JPV-vboWfhY&list=PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi&index=7' },
    { id: 8, title: 'Standard Signs', url: 'https://www.youtube.com/watch?v=qcdivQfA41Y&list=PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi&index=8' }
    // Add more videos as needed
];

const coursePage = () => {
    const [selectedVideo, setSelectedVideo] = useState(videos[0]);
    const [doubt, setDoubt] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVideoClick = (video) => {
        setLoading(true);
        setSelectedVideo(video);
        setLoading(false);
    };
    const handleDoubtSubmit = () => {
        if (!doubt) {
            alert('Please enter your doubt before submitting.');
            return;
        }
        alert(`Doubt submitted: ${doubt}`);
    };
    return (
        <div className='coursessPage'>
            {/* Left Side Vertical Column */}
            <div style={{ width: '20%', borderRight: '1px solid #ccc', padding: '10px' }}>
                <h2>Video List</h2>
                <ul className='video-list'>
                    {videos?.map((video) => (
                        <li key={video.id} onClick={() => handleVideoClick(video)}>
                            {video.title}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Video Section */}
            <div className='video-section'>
                {/* <h2>Video Player</h2> */}
                {loading && <p>Loading...</p>}
                {selectedVideo ? (
                    <ReactPlayer
                        url={selectedVideo.url}
                        controls
                        width="100%"
                        height="400px"
                    />
                ) : (
                    <p>Select a video from the list to play.</p>
                )}
            </div>

            {/* Text Box Section */}
            <div style={{ width: '20%', padding: '10px' }}>
                <h2>Ask Your Doubt</h2>
                <textarea
                    rows="4"
                    cols="30"
                    placeholder="Type your doubt here..."
                    value={doubt}
                    onChange={(e) => setDoubt(e.target.value)}
                />
                <button className='button-new' onClick={() => alert(`Doubt submitted: ${doubt}`)}>Submit Doubt</button>
            </div>
        </div>
    );
};

export default coursePage;
