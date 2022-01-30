import { Fragment, useState, useEffect, useContext } from "react";
import Context from "../context/context";
import styles from "../css/Observations.module.css";
import "react-vis/dist/style.css";
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis } from "react-vis";

const Observations = () => {
  const ctx = useContext(Context);
  const [newData, setNewData] = useState();
  useEffect(() => {
    if (ctx.observations.total_observations > 1) {
      setNewData(
        ctx.observations.observations.map((observation) => {
          let period = observation.dimensions.Time.label;
          let value = +observation.observation;
          return {
            x: period,
            y: value,
          };
        })
      );
    } else {
      setNewData();
    }
  }, [ctx.observations]);
  return (
    <div className={styles.observations}>
      {!ctx.observations && <div>Error Getting Data. Contact Support.</div>}
      {ctx.observations.total_observations === 0 && (
        <div>No Observations for the criteria selected.</div>
      )}
      {ctx.observations.total_observations > 0 && (
        <Fragment>
          {ctx.observations.total_observations > 1 && (
            <div className={styles.block}>
              <FlexibleXYPlot xType="ordinal" margin={{ bottom: 150 }}>
                <XAxis tickLabelAngle={-90} />
                <YAxis />
                <VerticalBarSeries data={newData} />
              </FlexibleXYPlot>
            </div>
          )}
          {ctx.observations.total_observations === 1 && <p className={styles.p}>Only One Value</p>}
          <table className={styles.table}>
            <tbody>
              <tr>
                {ctx.observations.observations[0].dimensions &&
                  Object.keys(ctx.observations.observations[0].dimensions) && (
                    <td>
                      {Object.keys(ctx.observations.observations[0].dimensions)}
                    </td>
                  )}
                <td>Observation</td>
              </tr>
              {ctx.observations.observations.map((observation, index) => {
                return (
                  <tr key={index + observation.observation}>
                    {ctx.observations.observations[0].dimensions && (
                      <td>
                        {
                          observation.dimensions[
                            Object.keys(
                              ctx.observations.observations[0].dimensions
                            )
                          ].label
                        }
                      </td>
                    )}

                    <td className={styles.valueCell}>
                      {observation.observation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Fragment>
      )}
    </div>
  );
};

export default Observations;
