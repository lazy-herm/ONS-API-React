import React, { useState } from "react";

const Context = React.createContext({
  datasets: undefined,
  datasetId: undefined,
  edition: null,
  version: null,
  editionList: null,
  versionList: null,
  dimensionList: null,
  observations: null,
  chartData: null,
  datasetHandler: () => {},
  datasetIdHandler: () => {},
  editionHandler: () => {},
  versionHandler: () => {},
  editionListHandler: () => {},
  versionListHandler: () => {},
  dimensionListHandler: () => {},
  observationsHandler: ()=>{},
  chartDataHandler: ()=>{},
});

export const ContextProvider = (props) => {
  const [datasets, setDatasets] = useState();
  const [datasetId, setDatasetId] = useState();
  const [edition, setEdition] = useState();
  const [version, setVersion] = useState();
  const [editionList, setEditionList] = useState();
  const [versionList, setVersionList] = useState();
  const [dimensionList, setDimensionList] = useState();
  const [observations, setObservations] = useState();
  const [chartData, setChartData] = useState();
  const datasetHandler = (data) => {
    setDatasets(data);
  };
  const datasetIdHandler = (id) => {
    if (id === "") {
      setDatasetId();
      setEditionList();
      setVersionList();
    } else {
      setDatasetId(id);
    }
  };
  const editionHandler = (edition) => {
    setEdition(edition);
  };
  const versionHandler = (version) => {
    setVersion(version);
  };

  const editionListHandler = (data) => {
    setEditionList(data);
  };
  const versionListHandler = (data) => {
    setVersionList(data);
  };
  const dimensionListHandler = (data) => {
    setDimensionList(data);
  };
  const observationsHandler = (data)=>{
    setObservations(data);
  }
  const chartDataHandler=(data)=>{
    setChartData(data);
  }

  return (
    <Context.Provider
      value={{
        datasets: datasets,
        datasetHandler: datasetHandler,
        datasetId: datasetId,
        datasetIdHandler: datasetIdHandler,
        edition: edition,
        editionHandler: editionHandler,
        version: version,
        versionHandler: versionHandler,
        editionList: editionList,
        editionListHandler: editionListHandler,
        versionList: versionList,
        versionListHandler: versionListHandler,
        dimensionList: dimensionList,
        dimensionListHandler: dimensionListHandler,
        observations: observations,
        observationsHandler: observationsHandler,
        chartData: chartData,
        chartDataHandler: chartDataHandler,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Context;
