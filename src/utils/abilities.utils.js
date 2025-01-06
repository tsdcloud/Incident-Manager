import {prisma} from '../config.js'
import { AbilityBuilder, Ability } from '@casl/ability';
import { createPrismaAbility } from '@casl/prisma';
import rolesUtils from '../utils/roles.utils.js';



export const consommableAbilities = async (
    roles,
    permissions,
    user
) =>{
    const { can, cannot, build } = new AbilityBuilder(createPrismaAbility);
    // ROLES
    if(roles.includes(rolesUtils.DEX) || roles.includes(rolesUtils.ROP)){
        can("delete","Consommable")
    }

    // PERMISSIONS
     if(permissions.includes("view_consommable")){
        can("read","Consommable", { createdBy: user.id, isActive:true });
     }

     if(permissions.includes("view_all_consommable")){
        can("read", "Consommable", { isAvtive: true });
     }

     if(permissions.includes("create_consommable")){
        can("create", "Consommable");
     }

     if(permissions.includes("update_consommable")){
        can("update", "Consommable", {createdBy: user.id, isActive:true});
     }
         
    return build();
}