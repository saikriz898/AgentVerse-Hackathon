"""Prompt loader and Jinja2 rendering engine for agent prompts."""

from pathlib import Path
from typing import Any, Dict, Optional
import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape
from app.utils.logger import logger


class PromptLoader:
    """Dynamic Jinja2 prompt template loader and renderer."""

    def __init__(self, prompts_dir: Optional[Path] = None, yaml_config_path: Optional[Path] = None):
        base_path = Path(__file__).parent.parent
        self.prompts_dir = prompts_dir or (base_path / "prompts")
        self.yaml_config_path = yaml_config_path or (base_path / "config" / "prompts.yaml")

        self.env = Environment(
            loader=FileSystemLoader(str(self.prompts_dir)),
            autoescape=select_autoescape(),
            trim_blocks=True,
            lstrip_blocks=True,
        )

        self._config: Dict[str, Any] = {}
        self._load_yaml_config()

    def _load_yaml_config(self) -> None:
        """Load template metadata from prompts.yaml."""
        if self.yaml_config_path.exists():
            try:
                with open(self.yaml_config_path, "r", encoding="utf-8") as f:
                    data = yaml.safe_load(f)
                    self._config = data.get("prompts", {}) if data else {}
            except Exception as e:
                logger.error(f"Failed to load prompts.yaml from {self.yaml_config_path}: {e}")

    def render(self, template_name: str, **kwargs: Any) -> str:
        """Render a named Jinja template with kwargs context.

        Args:
            template_name: Key in prompts.yaml or direct file name without extension.
            kwargs: Variables to inject into the template context.
        """
        # Determine actual template filename
        if template_name in self._config:
            filename = self._config[template_name].get("template_file", f"{template_name}.jinja")
        else:
            filename = f"{template_name}.jinja" if not template_name.endswith(".jinja") else template_name

        try:
            template = self.env.get_template(filename)
            rendered = template.render(**kwargs)
            logger.debug(f"Rendered prompt template '{filename}' ({len(rendered)} chars).")
            return rendered
        except Exception as e:
            logger.error(f"Error rendering Jinja template '{filename}': {e}")
            raise ValueError(f"Failed to render prompt template '{filename}'") from e
