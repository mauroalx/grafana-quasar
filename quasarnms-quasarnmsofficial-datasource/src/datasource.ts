import { getBackendSrv, isFetchError } from '@grafana/runtime';
import {
  CoreApp,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  // createDataFrame,
  FieldType,
  MutableDataFrame 
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY } from './types';
import { lastValueFrom } from 'rxjs';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  baseUrl: string;
  apiKey: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    // console.log(instanceSettings.jsonData,instanceSettings.apiKey)
    this.baseUrl = instanceSettings.jsonData.url!;
    this.apiKey = instanceSettings.jsonData.apiKey!
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return DEFAULT_QUERY;
  }

  filterQuery(query: MyQuery): boolean {
    // if no query has been provided, prevent the query from being executed

    return !!query.queryText;
  }

  // async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
  //   // const { range } = options;
  //   console.log(options)
  //   // const from = range!.from.valueOf();
  //   // const to = range!.to.valueOf();
  
  //   // Fetch data from the API
  //   const response = await this.request('/resources');
  
  //   // Assuming response.data has the format { columns: [...], rows: [...] }
  //   const data = response.data as unknown as { columns: string[]; rows: [string, number][] };
  
  //   // Ensure data has rows and columns to avoid runtime errors
  //   if (!data || !data.rows || !data.columns) {
  //     console.error('Unexpected response format', response);
  //     return { data: [] };
  //   }
  
  //   // Prepare the DataFrame based on the API response
  //   const dataFrame = new MutableDataFrame({
  //     refId: options.targets[0].refId,
  //     fields: [
  //       { name: 'ONT', type: FieldType.string, values: [] },
  //       { name: 'Signal', type: FieldType.number, values: [] },
  //     ],
  //   });
  
  //   // Populate the DataFrame with rows from the response
  //   data.rows.forEach((row) => {
  //     dataFrame.appendRow(row);
  //   });
  
  //   return { data: [dataFrame] };
  // }

  // async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
  //   const { targets } = options;
  
  //   const queries = targets.map(async (target) => {
  //     if (!target.host || !target.queryText) {
  //       return null;
  //     }
  
  //     // Fetch data from the API based on host and query text
  //     const response = await this.request('/resources', `host=${target.host}&query=${target.queryText}`);
  //     // const data = response.data as { columns: string[]; rows: any[] };
  //     const data = response.data as unknown as { columns: string[]; rows: [string, number][] };
  
  //     const dataFrame = new MutableDataFrame({
  //       refId: target.refId,
  //       fields: data.columns.map((col, index) => ({
  //         name: col,
  //         type: index === 0 ? FieldType.string : FieldType.number, // Adjust types accordingly
  //         values: data.rows.map((row) => row[index]),
  //       })),
  //     });
  
  //     return dataFrame;
  //   });
  
  //   const data = await Promise.all(queries);
  //   return { data: data.filter((df) => df !== null) as any[] };
  // }
  
  // async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
  //   const { targets } = options;
  
  //   // Handle multiple targets
  //   const queries = targets.map(async (target) => {
  //     if (!target.host || !target.queryText) {
  //       console.warn(`Skipping target due to missing host or query text: ${target}`);
  //       return null;
  //     }
  
  //     // Fetch data from the API based on host and query text
  //     const response = await this.request('/resources', `host=${target.host}&query=${target.queryText}`);
  //     const data = response.data as unknown;
  
  //     // Handle ONT OFFLINE query
  //     if (target.queryText.toLowerCase() === 'offline') {
  //       // Assuming data is in the format:
  //       // [{ ont_id: "1", ont_sn: "ABC123", ont_model: "ModelX", ont_description: "Desc1", last_down: "2024-11-15" }]
  //       const rows = data as Array<{
  //         ont_id: number;
  //         ont_sn: string;
  //         ont_model: string;
  //         ont_description: string;
  //         last_down: string;
  //       }>;
  
  //       const dataFrame = new MutableDataFrame({
  //         refId: target.refId,
  //         fields: [
  //           { name: 'ONT ID', type: FieldType.number, values: rows.map((row) => row.ont_id) },
  //           { name: 'ONT Serial', type: FieldType.string, values: rows.map((row) => row.ont_sn) },
  //           { name: 'ONT Model', type: FieldType.string, values: rows.map((row) => row.ont_model) },
  //           { name: 'ONT Description', type: FieldType.string, values: rows.map((row) => row.ont_description) },
  //           { name: 'Last Down', type: FieldType.time, values: rows.map((row) => new Date(row.last_down).getTime()) },
  //         ],
  //       });
  
  //       return dataFrame;
  //     }
  
  //     // Handle ONT SIGNAL query
  //     // if (target.queryText.toLowerCase() === 'ont signal') {
  //     //   // Assuming data is in the format:
  //     //   // [{ ont_id: "1", signal: -15.2 }, { ont_id: "2", signal: -20.5 }]
  //     //   const rows = data as Array<{ ont_id: string; signal: number }>;
  
  //     //   const dataFrame = new MutableDataFrame({
  //     //     refId: target.refId,
  //     //     fields: [
  //     //       { name: 'ONT ID', type: FieldType.string, values: rows.map((row) => row.ont_id) },
  //     //       { name: 'Signal Strength', type: FieldType.number, values: rows.map((row) => row.signal) },
  //     //     ],
  //     //   });
  
  //     //   return dataFrame;
  //     // }
  
  //     // Fallback for unrecognized queryText
  //     console.error(`Unrecognized query text: ${target.queryText}`);
  //     return null;
  //   });
  
  //   // Wait for all queries to resolve and filter out nulls
  //   const data = (await Promise.all(queries)).filter((df) => df !== null) as MutableDataFrame[];
  
  //   return { data };
  // }
  
  
  // async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
  //   const { targets } = options;
  
  //   // Handle multiple targets
  //   const queries = targets.map(async (target) => {
  //     if (!target.host || !target.queryText) {
  //       console.warn(`Skipping target due to missing host or query text: ${target}`);
  //       return null;
  //     }
  
  //     // Fetch data from the API based on host and query text
  //     const response = await this.request('/resources', `host=${target.host}&query=${target.queryText}`);
  //     const rawData = response.data as unknown;
  
  //     if (typeof rawData !== 'object' || !Array.isArray(rawData)) {
  //       console.error('Unexpected data format from API');
  //       return null;
  //     }
  
  //     const data = rawData[0]; // Assuming the API response is wrapped in an array
  
  //     console.log(data)

  //     if (!data || typeof data !== 'object') {
  //       console.error('No valid data found in the response');
  //       return null;
  //     }
  
  //     // Process ONT data
  //     const rows = Object.entries(data).map(([key, value]: [string, any]) => ({
  //       ont_id: key,
  //       basic: value.basic,
  //       desc: value.desc,
  //       fsp: value.fsp,
  //       profile: value.profile,
  //       status: value.status,
  //     }));
  
  //     // Create a DataFrame for Grafana
  //     const dataFrame = new MutableDataFrame({
  //       refId: target.refId,
  //       fields: [
  //         { name: 'ONT ID', type: FieldType.number, values: rows.map((row) => row.ont_id) },
  //         { name: 'Basic Info', type: FieldType.string, values: rows.map((row) => row.basic) },
  //         { name: 'Description', type: FieldType.string, values: rows.map((row) => row.desc) },
  //         { name: 'FSP', type: FieldType.string, values: rows.map((row) => row.fsp) },
  //         { name: 'Profile', type: FieldType.string, values: rows.map((row) => row.profile) },
  //         { name: 'Status', type: FieldType.number, values: rows.map((row) => row.status) },
  //       ],
  //     });
  
  //     return dataFrame;
  //   });
  
  //   // Wait for all queries to resolve and filter out nulls
  //   const data = (await Promise.all(queries)).filter((df) => df !== null) as MutableDataFrame[];
  
  //   return { data };
  // }
  

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { targets } = options;
  
    const queries = targets.map(async (target) => {
      if (!target.host || !target.queryText) {
        console.warn(`Skipping target due to missing host or query text: ${target}`);
        return null;
      }
  
      // Fetch data from the API
      const response = await this.request('/resources', `host=${target.host}&query=${target.queryText}`);
      const rawData = response.data;
  
      if (typeof rawData !== 'object') {
        console.error('Unexpected data format from API');
        return null;
      }
  
      // Process query based on queryText
      switch (target.queryText.toLowerCase()) {
        case 'all':
          return this.processAllQuery(rawData, target.refId);
  
        case 'count_offline':
          return this.processCountOfflineQuery(rawData, target.refId);

        case 'count_online':
          return this.processCountOnlineQuery(rawData, target.refId);

        case 'count_los':
          return this.processCountLosQuery(rawData, target.refId);

        case 'uptime':
          return this.processUptimeQuery(rawData, target.refId);
  
        default:
          console.error(`Unrecognized query text: ${target.queryText}`);
          return null;
      }
    });
  
    // Wait for all queries to resolve and filter out nulls
    const data = (await Promise.all(queries)).filter((df) => df !== null) as MutableDataFrame[];
    return { data };
  }
  
  // Handler for "all" query
  private processAllQuery(rawData: any, refId: string): MutableDataFrame {
    console.log('raw', rawData);
  
    // Define the type of each row in the data
    type RowData = {
      ont_id?: number;
      basic?: string;
      desc?: string;
      fsp?: string;
      profile?: string;
      status?: number;
    };
  
    // Flatten the nested arrays and enforce typing
    const flattenedData: RowData[] = (rawData || []).flat();
  
    // Convert flattened data to rows with defaults for missing values
    const rows = flattenedData.map((entry, index) => ({
      ont_id: entry.ont_id ?? index, // Use index if ont_id is not present
      basic: entry.basic ?? '',
      desc: entry.desc ?? '',
      fsp: entry.fsp ?? '',
      profile: entry.profile ?? '',
      status: entry.status ?? 0,
    }));
  
    // Create a DataFrame
    return new MutableDataFrame({
      refId,
      fields: [
        { name: 'ONT ID', type: FieldType.number, values: rows.map((row) => row.ont_id!) },
        { name: 'Basic Info', type: FieldType.string, values: rows.map((row) => row.basic) },
        { name: 'Description', type: FieldType.string, values: rows.map((row) => row.desc) },
        { name: 'FSP', type: FieldType.string, values: rows.map((row) => row.fsp) },
        { name: 'Profile', type: FieldType.string, values: rows.map((row) => row.profile) },
        { name: 'Status', type: FieldType.number, values: rows.map((row) => row.status!) },
      ],
    });
  }
  
  
  
  // Handler for "count_offline" query
  private processCountOfflineQuery(rawData: any, refId: string): MutableDataFrame {
    // Extract the count from the API response
    const offlineCount = rawData[0]?.count || 0;
  
    // Create a DataFrame with a single value
    return new MutableDataFrame({
      refId,
      fields: [
        { name: 'Metric', type: FieldType.string, values: ['Offline Count'] },
        { name: 'Count', type: FieldType.number, values: [offlineCount] },
      ],
    });
  }

  private processCountOnlineQuery(rawData: any, refId: string): MutableDataFrame {
    // Extract the count from the API response
    const offlineCount = rawData[0]?.count || 0;
  
    // Create a DataFrame with a single value
    return new MutableDataFrame({
      refId,
      fields: [
        { name: 'Metric', type: FieldType.string, values: ['Online Count'] },
        { name: 'Count', type: FieldType.number, values: [offlineCount] },
      ],
    });
  }

  private processUptimeQuery(rawData: any, refId: string): MutableDataFrame {
    // Extract the uptime in timeticks (1/100th of a second)
    let timeticks = rawData[0]?.uptime || 0;

    // Convert timeticks to seconds
    const seconds = Math.floor(timeticks / 100);

    // Calculate days, hours, minutes, and remaining seconds
    const days = Math.floor(seconds / 86400);
    const remainderAfterDays = seconds % 86400;
    const hours = Math.floor(remainderAfterDays / 3600);
    const remainderAfterHours = remainderAfterDays % 3600;
    const minutes = Math.floor(remainderAfterHours / 60);
    const remainingSeconds = remainderAfterHours % 60;

    // Format the uptime string
    const uptime = `${days} dias(s), ${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`;

    // Create a DataFrame with the formatted uptime
    return new MutableDataFrame({
        refId,
        fields: [
            { name: 'Uptime (formatted)', type: FieldType.string, values: [uptime] },
            { name: 'Uptime (seconds)', type: FieldType.number, values: [seconds] },
        ],
    });
  }



  private processCountLosQuery(rawData: any, refId: string): MutableDataFrame {
    // Extract the count from the API response
    const offlineCount = rawData[0]?.count || 0;
  
    // Create a DataFrame with a single value
    return new MutableDataFrame({
      refId,
      fields: [
        { name: 'Metric', type: FieldType.string, values: ['LOS Count'] },
        { name: 'Count', type: FieldType.number, values: [offlineCount] },
      ],
    });
  }
  

  async request<T>(url: string, params?: string) {
    // console.log(this.baseUrl)

    const response = getBackendSrv().fetch<T>({
      url: `${this.baseUrl}${url}${params?.length ? `?${params}` : ''}`,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    return lastValueFrom(response);
  }

  /**
   * Checks whether we can connect to the API.
   */
  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to API';

    try {
      const response = await this.request('/health');
      if (response.status === 200) {
        return {
          status: 'success',
          message: 'Success',
        };
      } else {
        return {
          status: 'error',
          message: response.statusText ? response.statusText : defaultErrorMessage,
        };
      }
    } catch (err) {
      let message = '';
      if (typeof err === 'string') {
        message = err;
      } else if (isFetchError(err)) {
        message = 'Fetch error: ' + (err.statusText ? err.statusText : defaultErrorMessage);
        if (err.data && err.data.error && err.data.error.code) {
          message += ': ' + err.data.error.code + '. ' + err.data.error.message;
        }
      }
      return {
        status: 'error',
        message,
      };
    }
  }
}
