import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ListChecks, Target } from 'lucide-react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function GoalsOverview({ goals }) {
  if (!goals || goals.length === 0) {
    return null; // Don't render anything if there are no goals
  }

  const completedGoals = goals.filter(g => g.status === 'הושלם').length;
  const inProgressGoals = goals.filter(g => g.status === 'בתהליך').length;
  const totalGoals = goals.length;

  const overallProgressData = goals.reduce((acc, goal) => {
    const totalTasks = goal.sub_tasks?.length || 0;
    if (totalTasks === 0) {
      if (goal.status === 'הושלם') {
        acc.completed += 1;
      }
      acc.total += 1;
      return acc;
    }
    const completedTasks = goal.sub_tasks.filter(t => t.is_completed).length;
    acc.completed += completedTasks;
    acc.total += totalTasks;
    return acc;
  }, { completed: 0, total: 0 });

  const overallProgress = overallProgressData.total > 0
    ? Math.round((overallProgressData.completed / overallProgressData.total) * 100)
    : 0;
  
  const chartData = [{ name: 'Progress', value: overallProgress }];

  return (
    <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-gray-800">התמונה הגדולה: ההתקדמות שלך</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-6 items-center">
        
        {/* Overall Progress Chart */}
        <div className="md:col-span-1 h-48 md:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
                className="fill-rose-500"
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-4xl font-bold fill-gray-800"
              >
                {`${overallProgress}%`}
              </text>
               <text
                x="50%"
                y="65%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm fill-gray-500"
              >
                הושלם
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Cards */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <Card className="text-center p-4 bg-green-50 border-green-200">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2"/>
                <p className="text-2xl font-bold text-green-800">{completedGoals}</p>
                <p className="text-sm text-green-700">מטרות שהושלמו</p>
            </Card>
             <Card className="text-center p-4 bg-blue-50 border-blue-200">
                <ListChecks className="w-8 h-8 text-blue-500 mx-auto mb-2"/>
                <p className="text-2xl font-bold text-blue-800">{inProgressGoals}</p>
                <p className="text-sm text-blue-700">מטרות בתהליך</p>
            </Card>
        </div>

        {/* Individual Goal Progress */}
        <div className="md:col-span-3 mt-4 space-y-4">
            <h3 className="font-semibold text-lg text-gray-700">התקדמות לפי מטרה:</h3>
            {goals.map(goal => {
                 const total = goal.sub_tasks?.length || 0;
                 const completed = goal.sub_tasks?.filter(t => t.is_completed).length || 0;
                 const progress = total > 0 ? (completed / total) * 100 : (goal.status === 'הושלם' ? 100 : 0);
                 return (
                     <div key={goal.id}>
                         <div className="flex justify-between items-center mb-1">
                            <p className="font-medium text-gray-800 flex items-center gap-2"><Target className="w-4 h-4 text-rose-400"/>{goal.title}</p>
                            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                         </div>
                         <Progress value={progress} />
                     </div>
                 )
            })}
        </div>

      </CardContent>
    </Card>
  );
}