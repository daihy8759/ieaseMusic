import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import Albums from './Albums';
import Artists from './Artists';
import styles from './index.module.less';
import Playlist from './Playlist';
import Users from './Users';
import Header from '/@/components/Header';
import { keywordState } from '/@/stores/search';

const a11yProps = (index: any) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            <Box p={3}>{children}</Box>
        </Typography>
    );
};

const Search = () => {
    const [keyword, setKeyword] = useRecoilState(keywordState);
    const [value, setValue] = useState(0);

    const loadMore = (e: any) => {
        // TODO load more
    };

    const handleTabChange = async (_: any, newValue: any) => {
        setValue(newValue);
    };

    return (
        <div className={styles.container}>
            <Header
                {...{
                    transparent: true,
                    showBack: true,
                }}
            />

            <main>
                <summary>
                    <input
                        type="text"
                        value={keyword}
                        placeholder="Search ..."
                        onChange={(e) => {
                            setKeyword(e.target.value);
                        }}
                    />
                </summary>
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="Playlist" {...a11yProps(0)} />
                    <Tab label="Album" {...a11yProps(1)} />
                    <Tab label="Singer" {...a11yProps(2)} />
                    <Tab label="User" {...a11yProps(3)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <section className={styles.list} onScroll={loadMore}>
                        {value === 0 && <Playlist />}
                    </section>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {/* <section className={styles.list} onScroll={loadMore}> */}
                    {value === 1 && <Albums />}
                    {/* </section> */}
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <section className={styles.list} onScroll={loadMore}>
                        {value === 2 && <Artists />}
                    </section>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <section className={styles.list} onScroll={loadMore}>
                        {value === 3 && <Users />}
                    </section>
                </TabPanel>
            </main>
        </div>
    );
};

export default Search;
