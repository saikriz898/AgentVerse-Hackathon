from typing import Dict, Any, List

class ActionItemEngine:
    """Action Item & Follow-up Extraction Engine identifying tasks, owners, due dates, and follow-up steps."""

    @classmethod
    def extract_action_items(cls, payload: Dict[str, Any], source_agent: str = "Review Agent") -> Dict[str, Any]:
        tasks: List[Dict[str, Any]] = []
        follow_ups: List[str] = []

        # 1. Parse payload list fields for actionable tasks
        actions = payload.get("high_priority_actions") or payload.get("actions") or payload.get("validated_metrics") or []

        if isinstance(actions, list):
            for idx, act in enumerate(actions):
                if isinstance(act, str):
                    tasks.append({
                        "task_id": f"task-act-0{idx+1}",
                        "task_description": act,
                        "owner": source_agent,
                        "due_date": "Next Sprint / T+24h",
                        "priority": "High"
                    })
                elif isinstance(act, dict):
                    desc = act.get("metric") or act.get("task") or str(act)
                    val = act.get("value") or "Verified"
                    tasks.append({
                        "task_id": f"task-act-0{idx+1}",
                        "task_description": f"{desc}: {val}",
                        "owner": source_agent,
                        "due_date": "Immediate",
                        "priority": "Normal"
                    })

        # Default fallback action item if none in payload
        if not tasks:
            tasks.append({
                "task_id": "task-act-01",
                "task_description": f"Review {source_agent} output and confirm executive delivery.",
                "owner": "Chief of Staff / Executive Assistant",
                "due_date": "Immediate (<30s)",
                "priority": "High"
            })

        # 2. Derive automated follow-up recommendations
        follow_ups.append("Schedule 24h status check with Chief of Staff.")
        follow_ups.append("Notify subagent coordinator upon executive approval.")

        return {
            "action_items_count": len(tasks),
            "action_items": tasks,
            "recommended_follow_ups": follow_ups
        }

action_item_engine = ActionItemEngine()
