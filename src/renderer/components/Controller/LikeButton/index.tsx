import { IconButton } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { FavoriteBorderTwoTone, FavoriteTwoTone } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { songState } from '/@/stores/controller';
import { isLiked, likedState, loginState, useToggleLike } from '/@/stores/me';

const useStyles = makeStyles({
    liked: {
        color: red[900],
        textShadow: `0 0 24px ${red[900]}`,
    },
});

const LikeButton = () => {
    const classes = useStyles();
    const [liked, setLiked] = useRecoilState(likedState);
    const song = useRecoilValue(songState);
    const toggleLike = useToggleLike();
    const logined = useRecoilValue(loginState);

    const fetchLiked = async () => {
        setLiked(await isLiked(song.id));
    };
    useEffect(() => {
        fetchLiked();
    }, [song.id]);

    return (
        <IconButton
            onClick={() => {
                toggleLike({ id: song.id, like: !liked });
            }}>
            {logined && liked ? <FavoriteTwoTone className={classes.liked} /> : <FavoriteBorderTwoTone />}
        </IconButton>
    );
};

export default LikeButton;
