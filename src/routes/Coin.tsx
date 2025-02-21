import {
    useParams,
    useLocation,
    Outlet,
    Link,
    useMatch,
    useNavigate,
} from "react-router-dom";
// import { useState, useEffect } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";

interface LocationParams {
    state: string;
}
interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}
interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_1h: number;
            percent_change_1y: number;
            percent_change_6h: number;
            percent_change_7d: number;
            percent_change_12h: number;
            percent_change_15m: number;
            percent_change_24h: number;
            percent_change_30d: number;
            percent_change_30m: number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
        };
    };
}

function Coin() {
    const { coinId } = useParams();
    // const { state } = useLocation() as LocationParams;
    const { state } = useLocation() as LocationParams;

    // const [loading, setLoading] = useState(true);
    // const [info, setInfo] = useState<InfoData>();
    // const [priceInfo, setPrice] = useState<PriceData>();
    const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
        ["info", coinId],
        () => fetchCoinInfo(coinId!)
    );
    const { isLoading: tickersLoading, data: tickersData } =
        useQuery<PriceData>(
            ["tickers", coinId],
            () => fetchCoinTickers(coinId!),
            {
                refetchInterval: 10000,
            }
        );

    const chartMatch = useMatch("/:coinId/chart");
    const priceMatch = useMatch("/:coinId/price");

    const navigate = useNavigate();

    // useEffect(() => {
    //     async function fetchData() {
    //         const infoData = await (
    //             await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
    //         ).json();

    //         const priceData = await (
    //             await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
    //         ).json();

    //         setInfo(infoData);
    //         setPrice(priceData);
    //         setLoading(false);
    //     }
    //     fetchData();
    // }, [coinId]);

    const loading = infoLoading || tickersLoading;

    return (
        <Container>
            <Helmet>
                <title>
                    {state ? state : loading ? "Loading..." : infoData?.name}
                </title>
            </Helmet>
            <Header>
                <Button onClick={() => navigate("/")}>🏠</Button>
                <Title>
                    당신의 코인코인 <br />
                    {state ? state : loading ? "Loading..." : infoData?.name}
                </Title>
            </Header>
            {loading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Overview>
                        <OverviewItem>
                            <span>Rank:</span>
                            <span>{infoData?.rank}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Symbol:</span>
                            <span>${infoData?.symbol}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Price:</span>
                            <span>
                                ${tickersData?.quotes.USD.price.toFixed(3)}
                            </span>
                        </OverviewItem>
                    </Overview>
                    <Description>{infoData?.description}</Description>
                    <Overview>
                        <OverviewItem>
                            <span>Total Suply:</span>
                            <span>{tickersData?.total_supply}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Max Supply:</span>
                            <span>{tickersData?.max_supply}</span>
                        </OverviewItem>
                    </Overview>
                </>
            )}

            <Tabs>
                <Tab isActive={chartMatch !== null}>
                    <Link to={`/${coinId}/chart`}>Chart</Link>
                </Tab>
                <Tab isActive={priceMatch !== null}>
                    <Link to={`/${coinId}/price`}>Price</Link>
                </Tab>
            </Tabs>

            <Outlet context={coinId} />
        </Container>
    );
}

const Container = styled.div`
    padding: 10px 20px;
`;
const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 50px 0;
`;
const Title = styled.h1`
    font-size: 48px;
`;
const Loader = styled.span`
    text-align: center;
    display: block;
`;

const Overview = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: ${(props) => props.theme.boxColor};
    padding: 10px 20px;
    border-radius: 10px;
`;
const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    span:first-child {
        font-size: 10px;
        font-weight: 400;
        text-transform: uppercase;
        margin-bottom: 5px;
    }
`;
const Description = styled.p`
    text-align: center;
    margin: 20px 0px;
`;
const Tabs = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 25px 0px;
    gap: 10px;
`;
const Tab = styled.span<{ isActive: boolean }>`
    text-align: center;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 400;
    background-color: ${(props) => props.theme.boxColor};
    padding: 7px 0px;
    border-radius: 10px;
    color: ${(props) =>
        props.isActive ? props.theme.btnColor : props.theme.textColor};
    a {
        display: block;
    }
`;
const Button = styled.button`
    margin: 10px;
    background: transparent;
    border: none;
    font-size: 50px;
    cursor: pointer;
`;

export default Coin;
