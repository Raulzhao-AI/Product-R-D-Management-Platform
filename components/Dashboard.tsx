import React, { useEffect, useRef } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import * as d3 from 'd3';
import { Requirement, RequirementStatus } from '../types';

interface DashboardProps {
  requirements: Requirement[];
}

const Dashboard: React.FC<DashboardProps> = ({ requirements }) => {
  const d3Container = useRef<SVGSVGElement>(null);

  // Calculate stats for Recharts
  const statusCounts = Object.values(RequirementStatus).map(status => ({
    name: status,
    count: requirements.filter(r => r.status === status).length
  }));

  // D3 Visualization: Simple Project Timeline / Activity Stream Bubble Chart
  useEffect(() => {
    if (d3Container.current) {
        const svg = d3.select(d3Container.current);
        svg.selectAll("*").remove(); // Clear previous

        const width = 400;
        const height = 200;

        const data = [
            { id: 1, r: 20, color: "#6366f1" },
            { id: 2, r: 35, color: "#8b5cf6" },
            { id: 3, r: 15, color: "#ec4899" },
            { id: 4, r: 25, color: "#14b8a6" },
            { id: 5, r: 30, color: "#f59e0b" },
        ];

        const simulation = d3.forceSimulation(data as any)
            .force("charge", d3.forceManyBody().strength(5))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius((d: any) => d.r + 2));

        const nodes = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", (d) => d.r)
            .attr("fill", (d) => d.color)
            .attr("opacity", 0.8);

        simulation.on("tick", () => {
            nodes
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);
        });
    }
  }, []);

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-semibold uppercase mb-2">需求总数</h3>
            <p className="text-4xl font-bold text-slate-800">{requirements.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-semibold uppercase mb-2">待评审</h3>
            <p className="text-4xl font-bold text-orange-500">
                {requirements.filter(r => r.status === RequirementStatus.REVIEW).length}
            </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-semibold uppercase mb-2">已完成</h3>
            <p className="text-4xl font-bold text-emerald-500">
                {requirements.filter(r => r.status === RequirementStatus.DONE).length}
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recharts: Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">需求状态分布</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* D3: Activity Bubbles */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">团队活跃热度 (D3)</h2>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden">
            <svg ref={d3Container} width="400" height="200" />
          </div>
          <p className="text-xs text-center text-slate-400 mt-2">近期开发活动密度的可视化展示</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
