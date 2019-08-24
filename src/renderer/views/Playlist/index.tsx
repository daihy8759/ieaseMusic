import { useStore } from '@/context';
import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';
import Controller from 'components/Controller';
import Header from 'components/Header';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import helper from 'utils/helper';
import * as styles from './index.less';

interface MatchParams {
    type: string;
}

interface IPlaylistProps extends RouteComponentProps<MatchParams> {}

const Playlist: React.SFC<IPlaylistProps> = observer(props => {
    const { match } = props;
    const { playlist, controller } = useStore();
    const listRef = React.useRef<HTMLElement>();

    React.useEffect(() => {
        loadList();
    }, [match.params.type]);

    const isPlaying = (id: number) => {
        return controller.playlist.id === id;
    };

    const loadList = () => {
        const { match } = props;
        playlist.getList(match.params.type);
    };

    const loadmore = async () => {
        const container = listRef.current;
        // Drop the duplicate invoke
        if (container.classList.contains(styles.loadmore)) {
            return;
        }

        if (container.scrollTop + container.offsetHeight + 50 > container.scrollHeight) {
            // Mark as loading
            container.classList.add(styles.loadmore);

            await playlist.loadmore();
            container.classList.remove(styles.loadmore);
        }
    };

    const renderList = () => {
        const { list } = playlist;

        return (
            <Grid container>
                {list.map((e: any, index: number) => {
                    return (
                        <Grid item xs={6} key={index}>
                            <article
                                className={classnames(styles.item, {
                                    [styles.playing]: isPlaying(e.id)
                                })}>
                                <Link to={e.link}>
                                    <ProgressImage
                                        {...{
                                            height: 64,
                                            width: 64,
                                            src: e.cover
                                        }}
                                    />
                                </Link>

                                <aside className={styles.info}>
                                    <p title={e.name}>{e.name}</p>
                                    <p>
                                        <Link to={e.user.link}>{e.user.name}</Link>
                                    </p>
                                    <span>{helper.humanNumber(e.played)} Played</span>
                                </aside>
                            </article>
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    const {
        match: { params }
    } = props;
    const { loading, types, list } = playlist;

    return (
        <div className={styles.container} data-type={encodeURIComponent(params.type)}>
            <Header
                {...{
                    transparent: true,
                    showBack: true
                }}
            />

            <div className={styles.inner}>
                <Loader show={loading} />

                <ul className={styles.navs}>
                    {types.map((e: any) => {
                        const selected = params.type === e.name;
                        return (
                            <li
                                key={e.name}
                                className={classnames(styles.nav, {
                                    [styles.selected]: selected
                                })}>
                                {selected ? (
                                    <Link to={`/playlist/${encodeURIComponent(e.name)}`}>
                                        {e.name} / {list.length} LIST
                                    </Link>
                                ) : (
                                    <Link to={`/playlist/${encodeURIComponent(e.name)}`}>{e.name}</Link>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <section className={styles.list} ref={listRef} onScroll={loadmore}>
                    {renderList()}
                </section>

                <Controller />
            </div>
        </div>
    );
});

export default Playlist;
