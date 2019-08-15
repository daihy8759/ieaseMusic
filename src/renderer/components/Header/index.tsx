import { useStore } from '@/context';
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
    const { controller, menu, playing, me, player } = useStore();
    const { song } = controller;
    const goBack = () => window.history.back();

    const renderBack = () => {
        const { showBack } = props;
        if (!showBack) {
            return false;
        }
        return <span className={styles.backward} onClick={goBack} />;
    };

    const renderPlaylist = () => {
        const { showPlaylist } = props;

        if (showPlaylist) {
            return <i className="remixicon-bar-chart-fill" onClick={() => playing.toggle(true)} />;
        }

        return false;
    };

    const renderFav = () => {
        if (!props.showFav || !me.hasLogin()) {
            return false;
        }

        if (player.meta.subscribed) {
            return (
                <i
                    className={classnames('remixicon-star-fill', styles.subscribed)}
                    onClick={e => player.subscribe(false)}
                />
            );
        }

        return <i className="remixicon-star-fill" onClick={e => player.subscribe(true)} />;
    };

    const renderMenu = () => {
        return <i className="remixicon-more-2-fill" onClick={() => menu.toggle(true)} />;
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
