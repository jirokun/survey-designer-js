import ItemDefinition from './ItemDefinition';
import PersonalItemDefinition from './PersonalItemDefinition';

const itemDefinitions = {
  ItemDefinition: { definitionClass: ItemDefinition },
  PersonalItemDefinition: { definitionClass: PersonalItemDefinition },
};

/** dataTypeから対応するDefinitionを取得する */
export function findItemDefinitionMap(type) {
  return itemDefinitions[`${type}Definition`]; // eslint-disable-line prefer-const
}
