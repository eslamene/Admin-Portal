import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { SystemWindow } from "./dto/systemwindow.model";
import { Role } from "./dto/role.model";

@Injectable()
export class UtileService {

    constructor(private config: ConfigService, private _http: HttpClient) {
    }

    validateMultipleConditions(input: string): boolean {
        // Regular expression pattern to match a single condition with integer or string values
        const conditionRegex = /^\s*(\w+)\s*(===|!==|==|!=|>|<|>=|<=)\s*(\w+)\s*$/;
    
        // Split the input string into individual conditions using logical operators (&& or ||)
        const conditions = input.split(/\s*(?=\|\||&&)\s*/);
    
        // Evaluate each condition
        for (let condition of conditions) {
            // Test if the condition string matches the condition pattern
            if (!conditionRegex.test(condition)) {
                // Return false if the condition string does not match the condition pattern
                return false;
            }
    
            // Extract parts of the condition using capturing groups
            const [, variable, operator, value] = condition.match(conditionRegex);
    
            // Convert value to number or remove quotes for string values
            const parsedValue = /^\d+$/.test(value) ? parseInt(value) : value.replace(/'/g, '');
    
            // Perform condition validation
            switch (operator) {
                case '===':
                    if (variable !== parsedValue) return false;
                    break;
                case '!==':
                    if (variable === parsedValue) return false;
                    break;
                case '==':
                    if (variable != parsedValue) return false;
                    break;
                case '!=':
                    if (variable == parsedValue) return false;
                    break;
                case '>':
                    if (!(variable > parsedValue)) return false;
                    break;
                case '<':
                    if (!(variable < parsedValue)) return false;
                    break;
                case '>=':
                    if (!(variable >= parsedValue)) return false;
                    break;
                case '<=':
                    if (!(variable <= parsedValue)) return false;
                    break;
                default:
                    return false;
            }
        }
    
        // All conditions passed
        return true;
    }
        
    replaceUrlExpression(url,valuesObject){
        console.log(typeof valuesObject);
        if(typeof valuesObject=='string' || typeof valuesObject=='number'){
          var indexOfStartEXP=url.indexOf("{");
          var indexOfEndEXP=url.indexOf("}");
          var expName = url.substring(indexOfStartEXP+1,indexOfEndEXP);
          url = url.replace("{"+expName+"}",valuesObject);
        }
        else {
        while(url.indexOf("{") > 0 ||url.indexOf("}") > 0){
          var indexOfStartEXP=url.indexOf("{");
          var indexOfEndEXP=url.indexOf("}");
          var expName = url.substring(indexOfStartEXP+1,indexOfEndEXP);
          url = url.replace("{"+expName+"}",valuesObject[expName]);
        }
      }
       return  url ;
      }


      systemExpression(exp,valuesObject,parentValues){
        while(exp.indexOf("#[") > 0){
          var indexOfStartEXP=exp.indexOf("#[");
          var indexOfEndEXP=exp.indexOf("]");
          var expName = exp.substring(indexOfStartEXP+2,indexOfEndEXP);
          exp = exp.replace("#["+expName+"]",valuesObject[expName]);
        }
        if(parentValues){
        while(exp.indexOf("#parent{") > 0){
            var indexOfStartEXP=exp.indexOf("#parent{");
            var indexOfEndEXP=exp.indexOf("}");
            var expName = exp.substring(indexOfStartEXP+8,indexOfEndEXP);
            exp = exp.replace("#parent{"+expName+"}",parentValues[expName]);
        }
      }
       return  exp ;
      }




      checkSystemAdminRole():boolean {
        let  role:Role[] = JSON.parse(localStorage.getItem("roles"));
        var r =role.filter((rl)=>{return rl.name.toLowerCase()=="system admin";});
         var currentRole = Number.parseInt(localStorage.getItem("active_role"));
        return r!=null&&currentRole==r[0].id;
      }
}