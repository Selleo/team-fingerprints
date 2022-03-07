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
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { AdditionalData, Shape } from "../../types/models";
import "./styles.sass";

interface IProps {
  data: any;
  additionalData: AdditionalData[];
}

const ROW_HEIGHT_PX = 60;

type TrendResults = {
  avgTrendAnswer: number;
  trendId: string;
  trendPrimary: string;
  trendSecondary: string;
};

type CategoryResults = {
  categoryId: string;
  categoryTitile: string;
  avgTrends: TrendResults[];
};

type TrendToDisplay = TrendResults & { categoryTitile: string };

const asTrends = (data: CategoryResults[]) => {
  const tmpTrends: TrendToDisplay[] = [];
  data?.forEach?.((category) => {
    category.avgTrends.forEach((trend) => {
      tmpTrends.push({ ...trend, categoryTitile: category.categoryTitile });
    });
  });
  return tmpTrends;
};

const Chart: FC<IProps> = ({ data, additionalData }) => {
  const { width: screenWidth } = useWindowDimensions();
  const dataReadyToUse = data?.surveysAnswers[0]
    .surveyResult as CategoryResults[];

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const pixelRatio = window.devicePixelRatio;
  const ref = useRef<any>(null);
  const canvas = useRef<any>(null);
  // responsive width and height
  useEffect(() => {
    setWidth(ref.current?.clientWidth);
    setHeight(ref.current?.clientHeight);
  }, []);

  const displayWidth = Math.floor(pixelRatio * width);
  const displayHeight = Math.floor(pixelRatio * height);
  const rowHeight = Math.floor(pixelRatio * ROW_HEIGHT_PX);

  const style = { width, height };

  const userMappedTrendsData = useMemo<TrendToDisplay[]>(() => {
    return asTrends(dataReadyToUse);
  }, [dataReadyToUse]);

  const numberOfRows = userMappedTrendsData.length;

  const renderResults = useCallback(
    (data: TrendToDisplay[], ctx: any, color = "#32A89C", shape?: Shape) => {
      const dotsPositions: { x: number; y: number }[] = [];
      //position of dots
      if (data.length !== numberOfRows) {
        return;
      }
      times(numberOfRows, (time) => {
        const positionOfLine = rowHeight / 2 + time * rowHeight;
        const result = data[time];
        const dotPosition =
          (displayWidth / 4) * ((result.avgTrendAnswer || 2.5) - 1);
        dotsPositions.push({ x: dotPosition, y: positionOfLine });
      });

      //connections between shapes
      ctx.beginPath();
      ctx.moveTo(dotsPositions[0].x, dotsPositions[0].y);
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      dotsPositions.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.closePath();

      times(numberOfRows, (time) => {
        const positionOfLine = rowHeight / 2 + time * rowHeight;
        ctx.beginPath();
        const result = data[time];
        const dotPosition =
          (displayWidth / 4) * ((result.avgTrendAnswer || 2.5) - 1);
        ctx.fillStyle = "#121212";
        if (shape === "circle") {
          ctx.arc(dotPosition, positionOfLine, 18, 0, 2 * Math.PI, true);
        } else {
          ctx.rect(dotPosition - 12, positionOfLine - 12, 24, 24);
        }
        ctx.fill();
        ctx.lineWidth = 12;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
      });
    },
    [displayWidth, numberOfRows, rowHeight]
  );

  useLayoutEffect(() => {
    const ctx = canvas.current?.getContext?.("2d");
    if (!ctx) {
      return;
    }
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
    });

    renderResults(userMappedTrendsData, ctx, "#32A89C", "circle");
    each(additionalData, ({ categories }) => {
      const datasetAsTrends = asTrends(categories);
      renderResults(datasetAsTrends, ctx, "#ffffffcc");
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
  ]);

  const resultChart = useMemo(() => {
    return (
      <div
        style={{
          width: screenWidth - 920,
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
  }, [displayHeight, displayWidth, numberOfRows, screenWidth, style]);

  const renderRow = (item: TrendToDisplay, index: number) => {
    const firstRow = index === 0;
    return (
      <tr>
        <td className="tg-0left">{item.trendSecondary}</td>
        {firstRow && (
          <td className="tg-0" rowSpan={numberOfRows}>
            {resultChart}
          </td>
        )}
        <td className="tg-0right">{item.trendPrimary}</td>
      </tr>
    );
  };

  return (
    <div className="chart">
      <table className="tg">
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
