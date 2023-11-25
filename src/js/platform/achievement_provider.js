/* typehints:start */
import {Application} from "../application";
import {Entity} from "../game/entity";
import {GameRoot} from "../game/root";
import {THEMES} from "../game/theme";
/* typehints:end */
import {enumAnalyticsDataSource} from "../game/production_analytics";
import {ShapeDefinition} from "../game/shape_definition";
import {ShapeItem} from "../game/items/shape_item";
import {globalConfig} from "../core/config";
/** @type {keyof typeof THEMES} */
const DARK_MODE = "dark";

const HOUR_1 = 3600; // Seconds
const HOUR_10 = HOUR_1 * 10;
const HOUR_20 = HOUR_1 * 20;
const ITEM_SHAPE = ShapeItem.getId();
const MINUTE_30 = 1800; // Seconds
const MINUTE_60 = MINUTE_30 * 2;
const MINUTE_120 = MINUTE_30 * 4;
const ROTATER_CCW_CODE = 12;
const ROTATER_180_CODE = 13;
