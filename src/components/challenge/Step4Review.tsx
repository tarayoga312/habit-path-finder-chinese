
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";

export const Step4Review = () => {
  const { getValues } = useFormContext();
  const values = getValues();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-medium">檢查並提交</h3>
        <p className="text-sm text-muted-foreground">
          請確認以下所有資訊都正確無誤。
        </p>
      </div>
      <div className="space-y-4 rounded-lg border p-4">
        <h4 className="font-semibold">基本資訊</h4>
        <p><strong>名稱:</strong> {values.name}</p>
        <p><strong>描述:</strong> {values.description}</p>
        <p><strong>持續天數:</strong> {values.duration_days}</p>
        {values.start_date && <p><strong>開始日期:</strong> {format(values.start_date, "PPP")}</p>}
        
        <h4 className="font-semibold mt-4">每日任務 ({values.tasks.length} 天)</h4>
        {values.tasks.length > 0 ? (
          <ul className="list-disc pl-5">
            {values.tasks.map((task: any, index: number) => (
              <li key={index}>Day {task.day_number}: {task.title}</li>
            ))}
          </ul>
        ) : <p className="text-muted-foreground">未定義每日任務。</p>}

        <h4 className="font-semibold mt-4">追蹤指標 ({values.metrics.length} 個)</h4>
        {values.metrics.length > 0 ? (
        <ul className="list-disc pl-5">
          {values.metrics.map((metric: any, index: number) => (
            <li key={index}>{metric.metric_name} ({metric.metric_type})</li>
          ))}
        </ul>
        ) : <p className="text-muted-foreground">未定義追蹤指標。</p>}
      </div>
    </div>
  );
};
