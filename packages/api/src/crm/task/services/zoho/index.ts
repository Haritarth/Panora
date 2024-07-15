import { Injectable } from '@nestjs/common';
import { ITaskService } from '@crm/task/types';
import { CrmObject } from '@crm/@lib/@types';
import { ZohoTaskInput, ZohoTaskOutput } from './types';
import axios from 'axios';
import { LoggerService } from '@@core/@core-services/logger/logger.service';
import { PrismaService } from '@@core/@core-services/prisma/prisma.service';
import { ActionType, handle3rdPartyServiceError } from '@@core/utils/errors';
import { EncryptionService } from '@@core/@core-services/encryption/encryption.service';
import { ApiResponse } from '@@core/utils/types';
import { ServiceRegistry } from '../registry.service';
import { SyncParam } from '@@core/utils/types/interface';

@Injectable()
export class ZohoService implements ITaskService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
    private cryptoService: EncryptionService,
    private registry: ServiceRegistry,
  ) {
    this.logger.setContext(
      CrmObject.task.toUpperCase() + ':' + ZohoService.name,
    );
    this.registry.registerService('zoho', this);
  }

  async addTask(
    taskData: ZohoTaskInput,
    linkedUserId: string,
  ): Promise<ApiResponse<ZohoTaskOutput>> {
    try {
      const connection = await this.prisma.connections.findFirst({
        where: {
          id_linked_user: linkedUserId,
          provider_slug: 'zoho',
          vertical: 'crm',
        },
      });
      const resp = await axios.post(
        `${connection.account_url}/Tasks`,
        { data: [taskData] },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Zoho-oauthtoken ${this.cryptoService.decrypt(
              connection.access_token,
            )}`,
          },
        },
      );
      //this.logger.log('zoho resp is ' + JSON.stringify(resp));
      return {
        data: resp.data.data,
        message: 'Zoho task created',
        statusCode: 201,
      };
    } catch (error) {
      throw error;
    }
  }

  async sync(data: SyncParam): Promise<ApiResponse<ZohoTaskOutput[]>> {
    try {
      const { linkedUserId } = data;

      const connection = await this.prisma.connections.findFirst({
        where: {
          id_linked_user: linkedUserId,
          provider_slug: 'zoho',
          vertical: 'crm',
        },
      });
      const fields =
        'Status,Owner,Description,Due_Date,Priority,Closed_Time,Subject,What_Id';
      const resp = await axios.get(
        `${connection.account_url}/Tasks?fields=${fields}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Zoho-oauthtoken ${this.cryptoService.decrypt(
              connection.access_token,
            )}`,
          },
        },
      );
      //this.logger.log('CONTACTS ZOHO ' + JSON.stringify(resp.data.data));
      this.logger.log(`Synced zoho tasks !`);
      return {
        data: resp.data.data,
        message: 'Zoho tasks retrieved',
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }
}
