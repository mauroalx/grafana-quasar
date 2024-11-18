import React, { ChangeEvent, useState } from 'react';
import { InlineField, Input, AsyncSelect, Stack } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';
// import * as ds from "datasource"

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery, datasource }: Props) {
  const [isFetching, setFetching] = useState(false);

  const onHostChange = (selected: SelectableValue<string>) => {
    if (selected?.value) {
      onChange({ ...query, host: selected.value });
      onRunQuery();
    }
  };
  

  const onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, queryText: event.target.value });
    onRunQuery();
  };

  const loadHosts = async (inputValue: string) => {
    setFetching(true);
    try {
      // Specify the response type as an array of { id: number; name: string }
      const response = await datasource.request<{ id: number; name: string }[]>('/api/hosts');
  
      // Transform the response into { label, value } format with value as a string
      return response.data.map((host) => ({
        label: host.name,
        value: host.id.toString(), // Convert the number to a string
      }));
    } catch (error) {
      console.error('Error fetching hosts:', error);
      return [];
    } finally {
      setFetching(false);
    }
  };
  

  const { host, queryText } = query;

  return (
    <Stack gap={0}>
      <InlineField label="Host" labelWidth={16}>
        <AsyncSelect
          loadOptions={loadHosts}
          onChange={onHostChange}
          value={host ? { label: host, value: host } : null}
          placeholder="Type to search hosts..."
          isLoading={isFetching}
        />
      </InlineField>
      <InlineField label="Query Text" labelWidth={16}>
        <Input
          id="query-editor-query-text"
          onChange={onQueryTextChange}
          value={queryText || ''}
          placeholder="Enter a query"
        />
      </InlineField>
    </Stack>
  );
}
