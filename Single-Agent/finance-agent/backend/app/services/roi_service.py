from typing import Dict, Any, List

class ROIService:
    def calculate_roi(
        self,
        dev_investment: float = 180000.0,
        monthly_operating_cost: float = 8500.0,
        monthly_arpu: float = 49.0,
        target_subscribers: int = 1500,
        annual_growth_rate: float = 0.25
    ) -> Dict[str, Any]:
        annual_operating_cost = monthly_operating_cost * 12.0
        total_initial_investment = dev_investment + annual_operating_cost

        # 3-Year Revenue Projections
        year1_rev = monthly_arpu * target_subscribers * 12.0
        year2_rev = year1_rev * (1.0 + annual_growth_rate)
        year3_rev = year2_rev * (1.0 + annual_growth_rate)

        year1_ops = annual_operating_cost
        year2_ops = annual_operating_cost * 1.15 # 15% ops growth
        year3_ops = annual_operating_cost * 1.30

        year1_net = year1_rev - (dev_investment + year1_ops)
        year2_net = year2_rev - year2_ops
        year3_net = year3_rev - year3_ops

        cumulative_net_3yr = year1_net + year2_net + year3_net
        roi_percentage_3yr = round((cumulative_net_3yr / dev_investment) * 100, 2)

        monthly_revenue = monthly_arpu * target_subscribers
        monthly_net_profit = monthly_revenue - monthly_operating_cost

        break_even_month = math.ceil(dev_investment / monthly_net_profit) if monthly_net_profit > 0 else 999
        payback_period_years = round(break_even_month / 12.0, 1)
        profit_margin = round((monthly_net_profit / monthly_revenue) * 100, 2) if monthly_revenue > 0 else 0.0

        monthly_chart_data = []
        cum_cost = dev_investment
        cum_rev = 0.0
        for m in range(1, 37):
            growth_factor = min(1.0, m / 12.0)
            cur_subscribers = int(target_subscribers * growth_factor * (1 + 0.02 * (m - 1)))
            cur_rev = cur_subscribers * monthly_arpu
            cur_ops = monthly_operating_cost * (1 + 0.01 * (m - 1))
            cum_cost += cur_ops
            cum_rev += cur_rev
            monthly_chart_data.append({
                "month": f"M{m}",
                "monthly_revenue": round(cur_rev, 2),
                "monthly_expenses": round(cur_ops, 2),
                "cumulative_revenue": round(cum_rev, 2),
                "cumulative_cost": round(cum_cost, 2),
                "net_position": round(cum_rev - cum_cost, 2)
            })

        return {
            "dev_investment": dev_investment,
            "annual_operating_cost": annual_operating_cost,
            "total_initial_investment": total_initial_investment,
            "target_subscribers": target_subscribers,
            "monthly_arpu": monthly_arpu,
            "monthly_revenue": round(monthly_revenue, 2),
            "monthly_net_profit": round(monthly_net_profit, 2),
            "roi_percentage_3yr": roi_percentage_3yr,
            "break_even_month": break_even_month,
            "payback_period_years": payback_period_years,
            "profit_margin": profit_margin,
            "projections": {
                "year1": {"revenue": round(year1_rev, 2), "expenses": round(year1_ops, 2), "net": round(year1_net, 2)},
                "year2": {"revenue": round(year2_rev, 2), "expenses": round(year2_ops, 2), "net": round(year2_net, 2)},
                "year3": {"revenue": round(year3_rev, 2), "expenses": round(year3_ops, 2), "net": round(year3_net, 2)},
            },
            "monthly_chart_data": monthly_chart_data
        }

roi_service = ROIService()
import math
