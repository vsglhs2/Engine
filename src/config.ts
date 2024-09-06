import { Any } from "./engine/decorators";
import Entity from "./engine/entity/entity";
import Point from "./engine/primitives/point";
import Size from "./engine/primitives/size";
import { AnyConverter, JsonConverter, PrimitiveConverter, ObjectConverter } from "./studio/components";
import { converterComponents } from "./studio/stores";

converterComponents.addConvertibleValueComponent(
    Any, AnyConverter
);

converterComponents.addConvertibleValueComponent(
    Point, JsonConverter
);

converterComponents.addConvertibleValueComponent(
    Size, JsonConverter
);

converterComponents.addConvertibleValueComponent(
    Number, PrimitiveConverter
);

converterComponents.addConvertibleValueComponent(
    String, PrimitiveConverter
);

converterComponents.addConvertibleValueComponent(
    Boolean, PrimitiveConverter
);

converterComponents.addConvertibleValueComponent(
    Entity, ObjectConverter
);
