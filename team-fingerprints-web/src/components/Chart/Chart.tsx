import { times } from "lodash";
import {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./style.css";

interface IProps {
  data: any;
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

const Chart: FC<IProps> = ({ data }: { data: any }) => {
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

  const mappedTrends = useMemo<TrendToDisplay[]>(() => {
    const tmpTrends: TrendToDisplay[] = [];
    dataReadyToUse?.forEach?.((category) => {
      category.avgTrends.forEach((trend) => {
        tmpTrends.push({ ...trend, categoryTitile: category.categoryTitile });
      });
    });
    return tmpTrends;
  }, [dataReadyToUse]);

  const numberOfRows = mappedTrends.length;

  useLayoutEffect(() => {
    const dotsPositions: { x: number; y: number }[] = [];
    const ctx = canvas.current?.getContext?.("2d");
    if (!ctx) {
      return;
    }
    times(numberOfRows, (time) => {
      const positionOfLine = rowHeight / 2 + time * rowHeight;
      ctx.beginPath();
      ctx.moveTo(0, positionOfLine);
      ctx.lineTo(displayWidth, positionOfLine);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.stroke();

      ctx.beginPath();
      const result = mappedTrends[time];
      const dotPosition = (displayWidth / 4) * (result.avgTrendAnswer - 1);
      ctx.arc(dotPosition, positionOfLine, 5, 0, 2 * Math.PI, true);
      dotsPositions.push({ x: dotPosition, y: positionOfLine });
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.fillStyle = "white";
      ctx.fill();
    });
    ctx.beginPath();
    ctx.moveTo(dotsPositions[0].x, dotsPositions[0].y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "yellow";
    dotsPositions.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  }, [
    width,
    height,
    displayWidth,
    displayHeight,
    numberOfRows,
    rowHeight,
    mappedTrends,
  ]);

  const resultChart = useMemo(() => {
    return (
      <div
        style={{
          width: "400px",
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
  }, [displayHeight, displayWidth, numberOfRows, style]);

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
    <table className="tg">
      <thead>
        {mappedTrends.map((item: TrendToDisplay, index: number) => {
          return renderRow(item, index);
        })}
      </thead>
    </table>
  );
};

export default Chart;
