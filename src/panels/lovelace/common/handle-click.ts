import { HomeAssistant } from "../../../types";
import { fireEvent } from "../../../common/dom/fire_event";
import { navigate } from "../../../common/navigate";
import { toggleEntity } from "../../../../src/panels/lovelace/common/entity/toggle-entity";
import { ActionConfig } from "../../../data/lovelace";

export const handleClick = (
  node: HTMLElement,
  hass: HomeAssistant,
  config: {
    entity?: string;
    hold_action?: ActionConfig;
    tap_action?: ActionConfig;
  },
  hold: boolean
): void => {
  let actionConfig: ActionConfig | undefined;

  if (hold && config.hold_action) {
    actionConfig = config.hold_action;
  } else if (!hold && config.tap_action) {
    actionConfig = config.tap_action;
  }

  if (!actionConfig) {
    actionConfig = {
      action: "more-info",
    };
  }

  switch (actionConfig.action) {
    case "more-info":
      if (config.entity) {
        fireEvent(node, "hass-more-info", { entityId: config.entity });
      }
      break;
    case "navigate":
      if (actionConfig.navigation_path) {
        navigate(node, actionConfig.navigation_path);
      }
      break;
    case "toggle":
      if (config.entity) {
        toggleEntity(hass, config.entity!);
      }
      break;
    case "call-service": {
      if (!actionConfig.service) {
        return;
      }
      const [domain, service] = actionConfig.service.split(".", 2);
      hass.callService(domain, service, actionConfig.service_data);
    }
  }
};
