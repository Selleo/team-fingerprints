import { each, times } from "lodash";
import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useWindowDimensions from "hooks/useWindowDimensions";
import {
  AdditionalData,
  CategoryResults,
  Shape,
  TrendResults,
} from "types/models";

import "./styles.sass";

interface IProps {
  surveyResult: CategoryResults[];
  additionalData: AdditionalData[];
  showMe: boolean;
}

const ROW_HEIGHT_PX = 80;

type TrendToDisplay = TrendResults & { categoryTitle: string };

const asTrends = (data: CategoryResults[]) => {
  const tmpTrends: TrendToDisplay[] = [];
  data?.forEach?.((category) => {
    category.avgTrends.forEach((trend) => {
      tmpTrends.push({ ...trend, categoryTitle: category.categoryTitle });
    });
  });
  return tmpTrends;
};

const Chart: FC<IProps> = ({ surveyResult, additionalData, showMe }) => {
  const { width: screenWidth } = useWindowDimensions();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const pixelRatio = window.devicePixelRatio;
  const ref = useRef<any>(null);
  const canvas = useRef<any>(null);
  const chart = useRef<any>(null);
  const data = useRef<any>(null);

  // responsive width and height
  useEffect(() => {
    setWidth(ref.current?.clientWidth);
    setHeight(ref.current?.clientHeight);
  }, [screenWidth]);

  const displayWidth = Math.floor(pixelRatio * width);
  const renderingAreaWidth = displayWidth - 50;
  const displayHeight = Math.floor(pixelRatio * height);
  const rowHeight = Math.floor(pixelRatio * ROW_HEIGHT_PX);

  const style = { width, height };

  const userMappedTrendsData = useMemo<TrendToDisplay[]>(() => {
    return asTrends(surveyResult);
  }, [surveyResult]);

  const numberOfRows = userMappedTrendsData.length;

  const renderResults = useCallback(
    (data: TrendToDisplay[], ctx: any, color: string, shape?: Shape) => {
      const dotsPositions: { x: number; y: number }[] = [];
      //position of dots
      if (data.length !== numberOfRows) {
        return;
      }

      times(numberOfRows, (time) => {
        const positionOfLine = rowHeight / 2 + time * rowHeight;
        const result = data[time];
        let dotPosition =
          (renderingAreaWidth / 4) * ((result.avgTrendAnswer || 3) - 1);

        //fix for edges of canvas
        dotPosition = dotPosition + 25;
        dotsPositions.push({ x: dotPosition, y: positionOfLine });
      });

      //connections between shapes
      ctx.beginPath();
      ctx.moveTo(dotsPositions[0].x, dotsPositions[0].y);
      ctx.lineWidth = 3;
      ctx.strokeStyle = color || "#c99284";
      dotsPositions.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.closePath();

      times(numberOfRows, (time) => {
        const positionOfLine = rowHeight / 2 + time * rowHeight;
        ctx.beginPath();
        const result = data[time];
        let dotPosition =
          (renderingAreaWidth / 4) * ((result.avgTrendAnswer || 3) - 1);

        //fix for edges of canvas
        dotPosition = dotPosition + 25;

        ctx.fillStyle = "#121212";
        switch (shape) {
          case "circle":
            ctx.arc(dotPosition, positionOfLine, 11, 0, 2 * Math.PI, true);
            break;
          case "triangle":
            ctx.moveTo(dotPosition, positionOfLine - 15);
            ctx.lineTo(dotPosition + 18, positionOfLine + 15);
            ctx.lineTo(dotPosition - 18, positionOfLine + 15);
            break;
          case "trapeze":
            ctx.moveTo(dotPosition, positionOfLine - 15);
            ctx.lineTo(dotPosition + 15, positionOfLine);
            ctx.lineTo(dotPosition, positionOfLine + 15);
            ctx.lineTo(dotPosition - 15, positionOfLine);
            break;
          default:
            ctx.rect(dotPosition - 12, positionOfLine - 10, 20, 20);
        }
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 8;
        ctx.strokeStyle = color || "#c99284";
        ctx.stroke();
      });
    },
    [displayWidth, numberOfRows, rowHeight]
  );

  useLayoutEffect(() => {
    const ctx = canvas.current?.getContext?.("2d");
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, displayWidth, displayHeight);
    // horizontal lines
    times(numberOfRows, (time) => {
      const positionOfLine = rowHeight / 2 + time * rowHeight;
      ctx.beginPath();
      ctx.moveTo(0, positionOfLine);
      ctx.lineTo(displayWidth, positionOfLine);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#FFFFFF1A";
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(displayWidth / 2, positionOfLine, 4, 0, 2 * Math.PI, true);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#FFFFFF1A";
      ctx.stroke();
      ctx.fillStyle = "#FFFFFF1A";
      ctx.fill();
      ctx.closePath();
    });

    showMe && renderResults(userMappedTrendsData, ctx, "#32A89C", "circle");
    each(additionalData, ({ categories, pointColor, pointShape }) => {
      const datasetAsTrends = asTrends(categories);
      renderResults(datasetAsTrends, ctx, pointColor, pointShape);
    });
  }, [
    width,
    height,
    displayWidth,
    displayHeight,
    numberOfRows,
    rowHeight,
    userMappedTrendsData,
    additionalData,
    renderResults,
    showMe,
  ]);

  const resultChart = useMemo(() => {
    const dataWidth = data.current?.clientHeight * 4;
    const chartWidth = chart.current?.clientWidth;
    return (
      <div
        style={{
          width: chartWidth - dataWidth,
          height: numberOfRows * ROW_HEIGHT_PX,
        }}
        ref={ref}
      >
        <canvas
          ref={canvas}
          width={displayWidth}
          height={displayHeight}
          style={style}
        />
      </div>
    );
  }, [
    displayHeight,
    displayWidth,
    numberOfRows,
    ROW_HEIGHT_PX,
    screenWidth,
    style,
  ]);

  const renderRow = (item: TrendToDisplay, index: number) => {
    const firstRow = index === 0;
    return (
      <tr className="chart__row" key={index}>
        <td className="chart__left" ref={data}>
          {item.trendSecondary}
        </td>
        {firstRow && (
          <td className="tg-0" rowSpan={numberOfRows}>
            {resultChart}
          </td>
        )}
        <td className="chart__right">{item.trendPrimary}</td>
      </tr>
    );
  };

  return (
    <div className="chart" ref={chart}>
      <table className="chart__table">
        <thead>
          {userMappedTrendsData.map((item: TrendToDisplay, index: number) => {
            return renderRow(item, index);
          })}
        </thead>
      </table>
    </div>
  );
};

export default Chart;
