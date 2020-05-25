import { useStore } from '@/context';
import { IconButton } from '@material-ui/core';
import { BarChartTwoTone, MoreVertTwoTone } from '@material-ui/icons';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import * as styles from './index.less';

interface IHeaderProps {
    showBack?: boolean;
    showFav?: boolean;
    showPlaylist?: boolean;
    className?: string;
    transparent?: boolean;
}

const Header: React.SFC<IHeaderProps> = observer(props => {
    const { controller, menu, me, player } = useStore();
    const { song } = controller;
    const goBack = () => window.history.back();

    const renderBack = () => {
        const { showBack = true } = props;
        if (!showBack) {
            return false;
        }
        return <span className={styles.backward} onClick={goBack} />;
    };

    const renderPlaylist = () => {
        const { showPlaylist } = props;

        if (showPlaylist) {
            return (
                <IconButton onClick={() => player.subscribe(true)}>
                    <BarChartTwoTone />
                </IconButton>
            );
        }

        return false;
    };

    const renderFav = () => {
        if (!props.showFav || !me.hasLogin()) {
            return false;
        }

        if (player.meta.subscribed) {
            return (
                <IconButton className="styles.subscribed" onClick={() => player.subscribe(false)}>
                    <BarChartTwoTone />
                </IconButton>
            );
        }

        return (
            <IconButton onClick={() => player.subscribe(true)}>
                <BarChartTwoTone />
            </IconButton>
        );
    };

    const renderMenu = () => {
        return (
            <IconButton onClick={() => menu.toggle(true)}>
                <MoreVertTwoTone />
            </IconButton>
        );
    };

    const { transparent, className } = props;

    return (
        <header className={classnames(styles.container, className)}>
            {song.id && transparent === false ? (
                <figure
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: '100%',
                        padding: 0,
                        margin: 0,
                        overflow: 'hidden'
                    }}>
                    <figcaption
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: window.innerWidth,
                            height: window.innerWidth,
                            padding: 0,
                            margin: 0,
                            backgroundImage: `url(${`${song.album.cover.replace(/\?param=.*/, '')}?param=800y800`})`,
                            backgroundSize: `${window.innerWidth}px ${window.innerWidth}px`,
                            filter: 'blur(20px)',
                            zIndex: -1
                        }}
                    />
                </figure>
            ) : (
                false
            )}

            <section
                className={classnames({
                    [styles.transparent]: transparent
                })}>
                {renderBack()}
                <div>
                    {renderFav()}
                    {renderPlaylist()}
                    {renderMenu()}
                </div>
            </section>
        </header>
    );
});

export default Header;
