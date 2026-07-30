import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { ChartWrapper, CHART_COLORS, chartConfig } from '@/components/shared/ChartWrapper'
import { subjectsData } from '@/pages/subjects/data'
import { monthlyTrendData, weeklyTrendData, REQUIRED_ATTENDANCE } from '../data'

export function AttendanceCharts() {
  // Subject-wise attendance data for bar chart
  const subjectBarData = subjectsData.map((s) => ({
    name: s.code,
    percentage: s.attendance.percentage,
    fill: s.attendance.percentage >= 85
      ? CHART_COLORS.success
      : s.attendance.percentage >= 75
        ? CHART_COLORS.warning
        : CHART_COLORS.error,
  }))

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Monthly Trend */}
      <ChartWrapper
        title="Monthly Attendance Trend"
        description="Overall attendance percentage per month"
        height={220}
        action={<span className="text-xs text-neutral-400">This Semester</span>}
      >
        <LineChart data={monthlyTrendData}>
          <CartesianGrid {...chartConfig.grid} vertical={false} />
          <XAxis dataKey="month" {...chartConfig.axis} tickLine={false} axisLine={false} />
          <YAxis {...chartConfig.axis} tickLine={false} axisLine={false} domain={[70, 100]} />
          <Tooltip {...chartConfig.tooltip} />
          <Line
            type="monotone"
            dataKey="percentage"
            stroke={CHART_COLORS.primary}
            strokeWidth={2.5}
            dot={{ r: 3, fill: CHART_COLORS.primary }}
            activeDot={{ r: 5 }}
            name="Attendance"
          />
          {/* Required line */}
          <Line
            type="monotone"
            dataKey={() => REQUIRED_ATTENDANCE}
            stroke={CHART_COLORS.error}
            strokeWidth={1}
            strokeDasharray="4 4"
            dot={false}
            name="Required (75%)"
          />
        </LineChart>
      </ChartWrapper>

      {/* Weekly Trend */}
      <ChartWrapper
        title="Weekly Breakdown"
        description="Attendance percentage by week this month"
        height={220}
        action={<span className="text-xs text-neutral-400">Last 8 Weeks</span>}
      >
        <BarChart data={weeklyTrendData}>
          <CartesianGrid {...chartConfig.grid} vertical={false} />
          <XAxis dataKey="week" {...chartConfig.axis} tickLine={false} axisLine={false} />
          <YAxis {...chartConfig.axis} tickLine={false} axisLine={false} domain={[60, 100]} />
          <Tooltip {...chartConfig.tooltip} />
          <Bar
            dataKey="percentage"
            fill={CHART_COLORS.primary}
            radius={[4, 4, 0, 0]}
            name="Attendance %"
          />
        </BarChart>
      </ChartWrapper>

      {/* Subject-wise Bar Chart */}
      <ChartWrapper
        title="Attendance by Subject"
        description="Comparison across all enrolled subjects"
        height={220}
        className="lg:col-span-2"
        action={<span className="text-xs text-neutral-400">Current Semester</span>}
      >
        <BarChart data={subjectBarData} layout="vertical">
          <CartesianGrid {...chartConfig.grid} horizontal={false} />
          <XAxis type="number" {...chartConfig.axis} tickLine={false} axisLine={false} domain={[0, 100]} />
          <YAxis type="category" dataKey="name" {...chartConfig.axis} tickLine={false} axisLine={false} width={50} />
          <Tooltip {...chartConfig.tooltip} />
          <Bar dataKey="percentage" radius={[0, 4, 4, 0]} name="Attendance %">
            {subjectBarData.map((entry, i) => (
              <rect key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartWrapper>
    </div>
  )
}
