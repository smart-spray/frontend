// Chakra imports
import {
  Flex,
  Grid,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import LineChart from "components/Charts/LineChart";
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import { useState, useEffect } from 'react';
import ActiveUsers from "./components/ActiveUsers";
import MiniStatistics from "./components/MiniStatistics";
import OrdersOverview from "./components/OrdersOverview";
import SalesOverview from "./components/SalesOverview";
import { barChartData, barChartOptions } from "../../../variables/charts"
import api from "./api/index";
import Card from "../../../components/Card/Card";
import Chart from "react-apexcharts";
import { FaHistory } from "react-icons/fa";

export default function Dashboard() {
  const [pulverizationHealth, setPulverizationHealth] = useState({
    deviceId: "",
    isClean: "",
    nozzleStatus: "",
    ph: "",
    weather: {
      condition: "",
      humidity: 0,
      pressure: 0,
      sensation: 0,
      temperature: 0,
      windDirection: "",
      windVelocity: 0
    }
  });
  const [pulverizations, setPulverizations] = useState([]);
  const [pulverizationsTime, setPulverizationsTime] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const iconBoxInside = useColorModeValue("white", "green");

  useEffect(
    () => {
      console.log('executando useffect');
      loadPulverizationsHealthData();
      loadPulverizationsData()
    }, [refresh]);

  async function loadPulverizationsHealthData() {
    const response = await api.get(
      "pulverizations/health/limpeza-esp32?city=São Bernardo do Campo&state=SP"
    );
    setPulverizationHealth(response.data);
  }

  async function loadPulverizationsData() {
    const response = await api.get(
      "/pulverizations"
    );
    setPulverizations(response.data);
    getPulverizationsTime();
  }
  function getHistoryDate() {
    try {
      console.log("getHistoryDate - pulverizations: " + pulverizations)
      const data = [];
      pulverizations.slice(0, 10).forEach(pulverization => {
        const datetime = pulverization.createdAt.substring(0, 10);
        data.push({
          logo: FaHistory,
          title: `Pulverização: ${pulverization._id}`,
          date: datetime,
          color: "green",
        })
      })
      return data;
    }
    catch (err) {
      console.log(pulverizations);
      console.log("m=getHistoryDate()", err);
    }
  }

  useEffect(
    () => {
      console.log('executando useffect');
      loadPulverizationsHealthData();
      loadPulverizationsData()
    }, [refresh]);

  function isClean(clean) {
    return (clean ? 'Sim' : 'Não');
  }
  async function getPulverizationsTime() {
    const dataNow = [];
    try {
      const response = await api.get(
        "/pulverizations"
      );
      response.data.slice(0, 9).forEach(element => {
        console.log(element.timeInSeconds);
        dataNow.push(element.timeInSeconds)
      });
    }
    catch (err) {
      console.log(err);
    }
    setPulverizationsTime([
      {
        name: "Duração da Pulverização (segundos)",
        data: dataNow,
      },
    ]);
  }

  console.log("Dados Carregados:")
  console.log(pulverizationHealth);

  return (
    <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='24px'>
        <MiniStatistics
          title={"Ultimo pH"}
          amount={pulverizationHealth.ph}
          icon={<WalletIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"Velocidade do Vento"}
          amount={pulverizationHealth.weather.windVelocity + " km/h"}
          icon={<GlobeIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"Status do bico"}
          amount={pulverizationHealth.nozzleStatus}
          icon={<DocumentIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"Está limpo?"}
          amount={isClean(pulverizationHealth.isClean)}
          icon={<CartIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
      </SimpleGrid>
      <Grid
        templateColumns={{ sm: "1fr", lg: "1.3fr 1.7fr" }}
        templateRows={{ sm: "repeat(2, 1fr)", lg: "1fr" }}
        gap='24px'
        mb={{ lg: "26px" }}>
        <ActiveUsers
          title={"Duração das pulverizações"}
          percentage={23}
          chart={<Card
            py="1rem"
            height={{ sm: "200px" }}
            width="100%"
            bg="linear-gradient(90.62deg, #acfea2 2.25%, #acfea2 79.87%)"
            position="relative"
          >
            <Chart
              options={barChartOptions}
              series={pulverizationsTime}
              type="bar"
              width="100%"
              height="100%"
            />
          </Card>}
        />
        <SalesOverview
          title={"Possível gráfico de comparação"}
          percentage={5}
          chart={<LineChart />}
        />
      </Grid>
      <Grid
        templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "2fr 1fr" }}
        templateRows={{ sm: "1fr auto", md: "1fr", lg: "1fr" }}
        gap='24px'>
        <OrdersOverview
          title={"Ultimas pulverizações"}
          data={getHistoryDate()}
        />
      </Grid>
    </Flex>
  );
}
