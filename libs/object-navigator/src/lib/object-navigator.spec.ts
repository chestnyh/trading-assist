import ObjectNavigator from './object-navigator';

describe('TradingDataService', () => {
  let service: ObjectNavigator;

  describe('initialization value', () => {
    it('should set {} as a default init value', () => {
      service = new ObjectNavigator();
      expect(service['data']).toEqual({});
    });


    it('should set provided object as init value', () => {
      const initData = { user: { name: 'Alice' } };
      service = new ObjectNavigator(initData);
      expect(service['data']).toEqual(initData);
    });
  });

  describe('set()', () => {

    describe('nesting level 1', () => {

      it('object_property', () => {
        const key = 'name';
        const value = 'Alice'
        service = new ObjectNavigator({});
        service.set(key, value);
        expect(service['data']).toEqual({ [key]: value });
      });

      it('array_item', () => {
        const key = '[]';
        const value = 1234;
        service = new ObjectNavigator([]);
        service.set(key, value);
        expect(service['data']).toEqual([value]);
      });

      it('array_item_with_index', () => {
        service = new ObjectNavigator([
          122,
          444,
          555
        ]);
        // replace element with index 1
        service.set('[1]', 789);
        expect(service['data']).toEqual([122, 789, 555]);
      });

      it('should throw an error if trying to set up property key into array', () => {
        service = new ObjectNavigator([]);
        expect(() => service.set('name', 'Bob')).toThrow('Can\'t set property to an array');
      });

      it('should throw an error if trying to set up array item into object', () => {
        service = new ObjectNavigator({});
        expect(() => service.set('[]', 'Hello world!!')).toThrow("Can't set array to not array");
      });

    });

    describe('nesting level 2', () => {

      describe('object_property.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.name';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: { name: value } });
        });

        it('should replace existed value', () => {
          const key = 'user.name';
          const value = 'Bob';
          service = new ObjectNavigator({ user: { name: 'Alice' } });
          service.set(key, value);
          expect(service['data']).toEqual({ user: { name: value } });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: [] });
          expect(() => service.set('user.name', 'Alice')).toThrow("Can't set property to an array");
        });
      });

      describe('object_property.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.[]';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: [value] });
        });

        it('should replace existed value', () => {
          const key = 'user.[0]';
          const value = 'Bob';
          service = new ObjectNavigator({ user: ['Alice'] });
          service.set(key, value);
          expect(service['data']).toEqual({ user: [value] });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: {} });
          expect(() => service.set('user.[0]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('array_item.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].name';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([{ name: value }]);
        });

        it('should replace existed value', () => {
          const key = '[1].name';
          const value = 'Bob';
          service = new ObjectNavigator([{ name: 'Alice' }, { name: 'Charlie' }]);
          service.set(key, value);
          expect(service['data']).toEqual([{ name: 'Alice' }, { name: value }]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([[]]);
          expect(() => service.set('[0].name', 'Alice')).toThrow("Can't set property to an array");
        });
      });

      describe('array_item.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].[]';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([[value]]);
        });

        it('should replace existed value', () => {
          const key = '[1].[1]';
          const value = 'Bob';
          service = new ObjectNavigator([
            ['Alice', 'Charlie'],
            ['Dave', 'Eve']
          ]);
          service.set(key, value);
          expect(service['data']).toEqual([
            ['Alice', 'Charlie'],
            ['Dave', value]
          ]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([{}]);
          expect(() => service.set('[0].[]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

    });

    describe('nesting level 3', () => {

      describe('object_property.object_property.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.profile.name';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: { profile: { name: value } } });
        });

        it('should replace existed value', () => {
          const key = 'user.profile.name';
          const value = 'Bob';
          service = new ObjectNavigator({ user: { profile: { name: 'Alice' } } });
          service.set(key, value);
          expect(service['data']).toEqual({ user: { profile: { name: value } } });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: { profile: [] } });
          expect(() => service.set('user.profile.name', 'Alice')).toThrow("Can't set property to an array");
        });
      });

      describe('object_property.object_property.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.profile.[]';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: { profile: [value] } });
        });

        it('should replace existed value', () => {
          const key = 'user.profile.[0]';
          const value = 'Bob';
          service = new ObjectNavigator({ user: { profile: ['Alice'] } });
          service.set(key, value);
          expect(service['data']).toEqual({ user: { profile: [value] } });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: { profile: {} } });
          expect(() => service.set('user.profile.[]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('object_property.array_item.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.[].name';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: [{ name: value }] });
        });

        it('should replace existed value', () => {
          const key = 'user.[0].name';
          const value = 'Bob';
          service = new ObjectNavigator({ user: [{ name: 'Alice' }] });
          service.set(key, value);
          expect(service['data']).toEqual({ user: [{ name: value }] });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: {} });
          expect(() => service.set('user.[0].name', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('array_item.object_property.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].user.name';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([{ user: { name: value } }]);
        });

        it('should replace existed value', () => {
          const key = '[1].user.name';
          const value = 'Bob';
          service = new ObjectNavigator([{ user: { name: 'Alice' } }, { user: { name: 'Charlie' } }]);
          service.set(key, value);
          expect(service['data']).toEqual([{ user: { name: 'Alice' } }, { user: { name: value } }]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([[]]);
          expect(() => service.set('[0].user.name', 'Alice')).toThrow("Can't set property to an array");
        });
      });

      describe('object_property.array_item.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.[].[]';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: [[value]] });
        });

        it('should replace existed value', () => {
          const key = 'user.[0].[1]';
          const value = 'Bob';
          service = new ObjectNavigator({ user: [['Alice', 'Charlie']] });
          service.set(key, value);
          expect(service['data']).toEqual({ user: [['Alice', value]] });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: {} });
          expect(() => service.set('user.[0].[0]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('array_item.object_property.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].user.[]';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([{ user: [value] }]);
        });

        it('should replace existed value', () => {
          const key = '[0].user.[0]';
          const value = 'Bob';
          service = new ObjectNavigator([{ user: ['Alice'] }]);
          service.set(key, value);
          expect(service['data']).toEqual([{ user: [value] }]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([{ user: {} }]);
          expect(() => service.set('[0].user.[0]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('array_item.array_item.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].[].name';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([[{ name: value }]]);
        });

        it('should replace existed value', () => {
          const key = '[1].[1].name';
          const value = 'Bob';
          service = new ObjectNavigator([
            [{ name: 'Alice' }, { name: 'Charlie' }],
            [{ name: 'Dave' }, { name: 'Eve' }]
          ]);
          service.set(key, value);
          expect(service['data']).toEqual([
            [{ name: 'Alice' }, { name: 'Charlie' }],
            [{ name: 'Dave' }, { name: value }]
          ]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([123]);
          expect(() => service.set('[0].[0].name', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('array_item.array_item.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].[].[]';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([[[value]]]);
        });

        it('should replace existed value', () => {
          const key = '[1].[1].[1]';
          const value = 'Bob';
          service = new ObjectNavigator([
            [
              ['Alice', 'Charlie'],
              ['Dave', 'Eve']
            ],
            [
              ['Frank', 'Grace'],
              ['Hank', 'Ivy']
            ]
          ]);
          service.set(key, value);
          expect(service['data']).toEqual([
            [
              ['Alice', 'Charlie'],
              ['Dave', 'Eve']
            ],
            [
              ['Frank', 'Grace'],
              ['Hank', value]
            ]
          ]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([123]);
          expect(() => service.set('[0].[0].[0]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

    });

    describe('nesting level 4', () => {

      describe('object_property.object_property.object_property.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.profile.details.name';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: { profile: { details: { name: value } } } });
        });

        it('should replace existed value', () => {
          const key = 'user.profile.details.name';
          const value = 'Bob';
          service = new ObjectNavigator({ user: { profile: { details: { name: 'Alice' } } } });
          service.set(key, value);
          expect(service['data']).toEqual({ user: { profile: { details: { name: value } } } });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: { profile: { details: [] } } });
          expect(() => service.set('user.profile.details.name', 'Alice')).toThrow("Can't set property to an array");
        });
      });


      describe('object_property.object_property.object_property.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.profile.details.[]';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: { profile: { details: [value] } } });
        });

        it('should replace existed value', () => {
          const key = 'user.profile.details.[0]';
          const value = 'Bob';
          service = new ObjectNavigator({ user: { profile: { details: ['Alice'] } } });
          service.set(key, value);
          expect(service['data']).toEqual({ user: { profile: { details: [value] } } });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: { profile: { details: {} } } });
          expect(() => service.set('user.profile.details.[0]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('object_property.object_property.array_item.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.profile.[].name';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: { profile: [{ name: value }] } });
        });

        it('should replace existed value', () => {
          const key = 'user.profile.[0].name';
          const value = 'Bob';
          service = new ObjectNavigator({ user: { profile: [{ name: 'Alice' }] } });
          service.set(key, value);
          expect(service['data']).toEqual({ user: { profile: [{ name: value }] } });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: { profile: {} } });
          expect(() => service.set('user.profile.[0].name', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('object_property.array_item.object_property.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.[].profile.name';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: [{ profile: { name: value } }] });
        });

        it('should replace existed value', () => {
          const key = 'user.[0].profile.name';
          const value = 'Bob';
          service = new ObjectNavigator({ user: [{ profile: { name: 'Alice' } }] });
          service.set(key, value);
          expect(service['data']).toEqual({ user: [{ profile: { name: value } }] });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: {} });
          expect(() => service.set('user.[0].profile.name', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('array_item.object_property.object_property.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].user.profile.name';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([{ user: { profile: { name: value } } }]);
        });

        it('should replace existed value', () => {
          const key = '[1].user.profile.name';
          const value = 'Bob';
          service = new ObjectNavigator([{ user: { profile: { name: 'Alice' } } }, { user: { profile: { name: 'Charlie' } } }]);
          service.set(key, value);
          expect(service['data']).toEqual([{ user: { profile: { name: 'Alice' } } }, { user: { profile: { name: value } } }]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([[]]);
          expect(() => service.set('[0].user.profile.name', 'Alice')).toThrow("Can't set property to an array");
        });
      });


      describe('object_property.object_property.array_item.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.profile.[].[]';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: { profile: [[value]] } });
        });

        it('should replace existed value', () => {
          const key = 'user.profile.[0].[1]';
          const value = 'Bob';
          service = new ObjectNavigator({ user: { profile: [['Alice', 'Charlie']] } });
          service.set(key, value);
          expect(service['data']).toEqual({ user: { profile: [['Alice', value]] } });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: { profile: {} } });
          expect(() => service.set('user.profile.[0].[0]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('object_property.array_item.object_property.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.[].profile.[]';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: [{ profile: [value] }] });
        });

        it('should replace existed value', () => {
          const key = 'user.[0].profile.[0]';
          const value = 'Bob';
          service = new ObjectNavigator({ user: [{ profile: ['Alice'] }] });
          service.set(key, value);
          expect(service['data']).toEqual({ user: [{ profile: [value] }] });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: [{ profile: {} }] });
          expect(() => service.set('user.[0].profile.[0]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('array_item.object_property.object_property.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].user.profile.[]';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([{ user: { profile: [value] } }]);
        });

        it('should replace existed value', () => {
          const key = '[0].user.profile.[0]';
          const value = 'Bob';
          service = new ObjectNavigator([{ user: { profile: ['Alice'] } }]);
          service.set(key, value);
          expect(service['data']).toEqual([{ user: { profile: [value] } }]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([{ user: { profile: {} } }]);
          expect(() => service.set('[0].user.profile.[0]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('object_property.array_item.array_item.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.[].[].name';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: [[{ name: value }]] });
        });

        it('should replace existed value', () => {
          const key = 'user.[0].[0].name';
          const value = 'Bob';
          service = new ObjectNavigator({ user: [[{ name: 'Alice' }]] });
          service.set(key, value);
          expect(service['data']).toEqual({ user: [[{ name: value }]] });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: {} });
          expect(() => service.set('user.[0].[0].name', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('array_item.object_property.array_item.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].user.[].name';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([{ user: [{ name: value }] }]);
        });

        it('should replace existed value', () => {
          const key = '[0].user.[0].name';
          const value = 'Bob';
          service = new ObjectNavigator([{ user: [{ name: 'Alice' }] }]);
          service.set(key, value);
          expect(service['data']).toEqual([{ user: [{ name: value }] }]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([{ user: {} }]);
          expect(() => service.set('[0].user.[0].name', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('array_item.array_item.object_property.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].[].user.profile';
          const value = { name: 'Alice' };
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([[{ user: { profile: value } }]]);
        });

        it('should replace existed value', () => {
          const key = '[1].[0].user.profile';
          const value = { name: 'Bob' };
          service = new ObjectNavigator(
            [
              [
                { user: { profile: { name: 'Alice' } } }
              ],
              [
                { user: { profile: { name: 'Charlie' } } }
              ]
            ]
          );
          service.set(key, value);
          expect(service['data']).toEqual(
            [
              [
                { user: { profile: { name: 'Alice' } } }
              ],
              [
                { user: { profile: value } }
              ]
            ]
          );
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([{}]);
          expect(() => service.set('[0].[0].user.profile', { name: 'Alice' })).toThrow("Can't set array to not array");
        });
      });



      describe('object_property.array_item.array_item.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = 'user.[].[].[]';
          const value = 'Alice';
          service = new ObjectNavigator({});
          service.set(key, value);
          expect(service['data']).toEqual({ user: [[[value]]] });
        });

        it('should replace existed value', () => {
          const key = 'user.[0].[0].[0]';
          const value = 'Bob';
          service = new ObjectNavigator({ user: [[['Alice']]] });
          service.set(key, value);
          expect(service['data']).toEqual({ user: [[[value]]] });
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator({ user: {} });
          expect(() => service.set('user.[0].[0].[0]', 'Alice')).toThrow("Can't set array to not array");
        });
      });


      describe('array_item.object_property.array_item.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].user.[].[]';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([{ user: [[value]] }]);
        });

        it('should replace existed value', () => {
          const key = '[0].user.[0].[0]';
          const value = 'Bob';
          service = new ObjectNavigator([{ user: [['Alice']] }]);
          service.set(key, value);
          expect(service['data']).toEqual([{ user: [[value]] }]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([{ user: {} }]);
          expect(() => service.set('[0].user.[].[]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('array_item.array_item.object_property.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].[].user.[]';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([[{ user: [value] }]]);
        });

        it('should replace existed value', () => {
          const key = '[0].[0].user.[0]';
          const value = 'Bob';
          service = new ObjectNavigator([[{ user: ['Alice'] }]]);
          service.set(key, value);
          expect(service['data']).toEqual([[{ user: [value] }]]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([[{ user: {} }]]);
          expect(() => service.set('[0].[0].user.[0]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

      describe('array_item.array_item.array_item.object_property', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].[].[].name';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([[[{ name: value }]]]);
        });

        it('should replace existed value', () => {
          const key = '[1].[1].[1].name';
          const value = 'Bob';
          service = new ObjectNavigator([
            [
              [{ name: 'Alice' }, { name: 'Charlie' }],
              [{ name: 'Dave' }, { name: 'Eve' }]
            ],
            [
              [{ name: 'Frank' }, { name: 'Grace' }],
              [{ name: 'Hank' }, { name: 'Ivy' }]
            ]
          ]);
          service.set(key, value);
          expect(service['data']).toEqual([
            [
              [{ name: 'Alice' }, { name: 'Charlie' }],
              [{ name: 'Dave' }, { name: 'Eve' }]
            ],
            [
              [{ name: 'Frank' }, { name: 'Grace' }],
              [{ name: 'Hank' }, { name: value }]
            ]
          ]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([{}]);
          expect(() => service.set('[0].[0].[0].name', 'Alice')).toThrow("Can't set array to not array");
        });
      });


      describe('array_item.array_item.array_item.array_item', () => {
        it('should set up specified value to the empty data object', () => {
          const key = '[].[].[].[]';
          const value = 'Alice';
          service = new ObjectNavigator([]);
          service.set(key, value);
          expect(service['data']).toEqual([[[[value]]]]);
        });

        it('should replace existed value', () => {
          const key = '[1].[1].[1].[0]';
          const value = 'Bob';
          service = new ObjectNavigator(
            [
              [
                [
                  ['Alice'],
                  ['Charlie']
                ],
                [
                  ['Dave'],
                  ['Eve']
                ]
              ],
              [
                [
                  ['Frank'],
                  ['Grace']
                ],
                [
                  ['Hank'],
                  ['Ivy']
                ]
              ]
            ]);
          service.set(key, value);
          expect(service['data'])
            .toEqual(
              [
                [
                  [
                    ['Alice'],
                    ['Charlie']
                  ],
                  [
                    ['Dave'],
                    ['Eve']]
                ],
                [
                  [
                    ['Frank'],
                    ['Grace']
                  ],
                  [
                    ['Hank'],
                    [value]
                  ]
                ]
              ]);
        });

        it('should throw an error if trying to set up in wrong type', () => {
          service = new ObjectNavigator([{}]);
          expect(() => service.set('[0].[0].[0].[0]', 'Alice')).toThrow("Can't set array to not array");
        });
      });

    });

  });

  describe('get()', () => {

    describe('nesting level 1', () => {

      describe('object_property', () => {

        beforeEach(() => {
          service['data'] = { name: 'Alice' };
        });

        it('should get a specified value', () => {
          expect(service.get('name')).toBe('Alice');
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('nonexistent')).toBeUndefined();
        });

        it('should return a specified default value for a non-existent', () => {
          expect(service.get('nonexistent', 'some_default')).toBe('some_default');
        });

      });

      describe('array_item', () => {

        beforeEach(() => {
          service = new ObjectNavigator([
            { value: 8 },
            { value: 14 },
            { value: "text" },
            { value: true },
            { value: null }
          ]);
        });

        it('should get a specified value', () => {
          expect(service.get('[0].value')).toBe(8);
          expect(service.get('[1].value')).toBe(14);
          expect(service.get('[2].value')).toBe("text");
          expect(service.get('[3].value')).toBe(true);
          expect(service.get('[4].value')).toBe(null);
          expect(service.get('[].value')).toBe(null);

          expect(service.get('[0].value', 'some_default')).toBe(8);
          expect(service.get('[1].value', 'some_default')).toBe(14);
          expect(service.get('[2].value', 'some_default')).toBe("text");
          expect(service.get('[3].value', 'some_default')).toBe(true);
          expect(service.get('[4].value', 'some_default')).toBe(null);
          expect(service.get('[].value', 'some_default')).toBe(null);
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('[5].value')).toBeUndefined();
          expect(service.get('nonexistent.this.and.this.and.this')).toBeUndefined();
          expect(service.get('nonexistent.[].value')).toBeUndefined();
          expect(service.get('[].nonexistent')).toBeUndefined();
        });

        it('should return a specified default value for a non-existent', () => {
          expect(service.get('[5].value', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.this.and.this.and.this', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.[].value', 'some_default')).toBe('some_default');
          expect(service.get('[].nonexistent', 'some_default')).toBe('some_default');
        });

        it('should get item array with negative index', () => {
          expect(service.get('[-3]')).toEqual({ value: "text" });
          expect(service.get('[-2]')).toEqual({ value: true });
          expect(service.get('[-1]')).toEqual({ value: null });
        });
      });

    });

    describe('nesting level 2', () => {
      describe('object_property.object_property', () => {
        beforeEach(() => {
          service['data'] = {
            company: {
              departments: [
                { name: 'IT' }
              ],
              name: 'ACME',
              isActive: true,

            },
            user: {
              age: 30,
              name: 'Alice',
              isActive: true
            }
          };
        });

        it('should get a specified value', () => {
          expect(service.get('company.name')).toBe('ACME');
          expect(service.get('user.name')).toBe('Alice');
          expect(service.get('company.departments')).toEqual([{ name: 'IT' }]);
          expect(service.get('user.isActive')).toBe(true);
          expect(service.get('company.isActive')).toBe(true);
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('company.nonexistent')).toBeUndefined();
          expect(service.get('user.nonexistent')).toBeUndefined();
          expect(service.get('company.departments.nonexistent')).toBeUndefined();
          expect(service.get('user.isActive.nonexistent')).toBeUndefined();
          expect(service.get('company.isActive.nonexistent')).toBeUndefined();
        });

        it('should return a specified default value for a non-existent', () => {
          expect(service.get('company.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('user.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('company.departments.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('user.isActive.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('company.isActive.nonexistent', 'some_default')).toBe('some_default');
        });
      });

      describe('object_property.array_item', () => {
        beforeEach(() => {
          service['data'] = {
            items: [
              { name: 'Alice' },
              11231223,
              false,
              null,
              'some_string'
            ]
          };
        });
        it('should get a specified value', () => {
          expect(service.get('items.[0]')).toEqual({ name: 'Alice' });
          expect(service.get('items.[1]')).toBe(11231223);
          expect(service.get('items.[2]')).toBe(false);
          expect(service.get('items.[3]')).toBe(null);
          expect(service.get('items.[4]')).toBe('some_string');
          expect(service.get('items.[]')).toBe('some_string');
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('items.[5]')).toBeUndefined();
          expect(service.get('items.nonexistent')).toBeUndefined();
          expect(service.get('items.[].nonexistent')).toBeUndefined();
        });

        it('should return a specified default value for a non-existent', () => {
          expect(service.get('items.[5]', 'some_default')).toBe('some_default');
          expect(service.get('items.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('items.[].nonexistent', 'some_default')).toBe('some_default');
        });
      });

      describe('array_item.object_property', () => {

        beforeEach(() => {
          service['data'] = [
            [
              { name: 'Alice' },
              { name: 'Bob' },
              { name: 'Charlie' }
            ],
            [
              { name: 'Dave' },
              { name: 'Eve' },
              { name: 'Frank' }
            ],
            [
              { name: 'George' },
              { name: 'Hank' },
              { name: 'Ian' }
            ]
          ];
        });

        it('should get a specified value', () => {
          expect(service.get('[].[].name')).toBe('Ian');
          expect(service.get('[1].[2].name')).toBe('Frank');
          expect(service.get('[2].[0].name')).toBe('George');
          expect(service.get('[].[1].name')).toBe('Hank');
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('[3].[0].name')).toBeUndefined();
          expect(service.get('[].[1].nonexistent')).toBeUndefined();
          expect(service.get('[].[].[].[].nonexistent')).toBeUndefined();
          expect(service.get('nonexistent.and.this.and.this.and.this')).toBeUndefined();
          expect(service.get('nonexistent.[].some.[].value')).toBeUndefined();
        });

        it('should return a specified default value for a non-existent', () => {
          expect(service.get('[3].[0].name', 'some_default')).toBe('some_default');
          expect(service.get('[].[1].nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('[].[].[].[].nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.and.this.and.this.and.this', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.[].some.[].value', 'some_default')).toBe('some_default');
        });
      });

      describe('array_item.array_item', () => {
        beforeEach(() => {
          service['data'] = [
            [true, false, true],
            [4, 5, 'yellow'],
            [7, { name: 'Brad' }, 9]
          ];
        });
        it('should get a specified value', () => {
          expect(service.get('[0].[0]')).toBe(true);
          expect(service.get('[].[1]')).toEqual({ name: 'Brad' });
          expect(service.get('[0].[1]')).toBe(false);
          expect(service.get('[2].[1]')).toEqual({ name: 'Brad' });
          expect(service.get('[2].[]')).toBe(9);
          expect(service.get('[].[]')).toBe(9);
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('[3].[0]')).toBeUndefined();
          expect(service.get('[3].[]')).toBeUndefined();
          expect(service.get('[].[2].nonexistent')).toBeUndefined();
        });

        it('should return a specified default value for a non-existent', () => {
          expect(service.get('[3].[0]', 'some_default')).toBe('some_default');
          expect(service.get('[3].[]', 'some_default')).toBe('some_default');
          expect(service.get('[].[2].nonexistent', 'some_default')).toBe('some_default');
        });
      });

    });

    describe('nesting level 3', () => {
      describe('object_property.object_property.object_property', () => {

        beforeEach(() => {
          service['data'] = {
            user: {
              profile: {
                age: 30,
                name: 'Alice',
                isActive: true
              },
              cart: {
                itemsCount: 3,
                total: 120
              }
            },
            company: {
              mainDepartment: {
                name: 'Main Department',
                isActive: true
              }
            }
          };
        });

        it('should get a specified value', () => {
          expect(service.get('user.profile.name')).toBe('Alice');
          expect(service.get('user.cart.itemsCount')).toBe(3);
          expect(service.get('company.mainDepartment.name')).toBe('Main Department');
          expect(service.get('user.profile.isActive')).toBe(true);
          expect(service.get('company.mainDepartment.isActive')).toBe(true);
          expect(service.get('user.cart.total')).toBe(120);
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('user.profile.nonexistent')).toBeUndefined();
          expect(service.get('user.cart.nonexistent')).toBeUndefined();
          expect(service.get('company.mainDepartment.nonexistent')).toBeUndefined();
          expect(service.get('user.profile.isActive.nonexistent')).toBeUndefined();
          expect(service.get('company.mainDepartment.isActive.nonexistent')).toBeUndefined();
        });

        it('should return a specified default value for a non-existent', () => {
          expect(service.get('user.profile.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('user.cart.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('company.mainDepartment.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('user.profile.isActive.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('company.mainDepartment.isActive.nonexistent', 'some_default')).toBe('some_default');
        });
      });

      describe('object_property.object_property.array_item', () => {
        it('should get a specified value', () => {
          // TODO
        });

        it('should return undefined for a non-existent', () => {
          // TODO
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO
        });
      });

      describe('object_property.array_item.object_property', () => {
        it('should get a specified value', () => {
          // TODO
        });

        it('should return undefined for a non-existent', () => {
          // TODO
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO
        });
      });

      describe('array_item.object_property.object_property', () => {
        it('should get a specified value', () => {
          // TODO
        });

        it('should return undefined for a non-existent', () => {
          // TODO
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO
        });
      });

      describe('array_item.object_property.array_item', () => {
        it('should get a specified value', () => {
          // TODO
        });

        it('should return undefined for a non-existent', () => {
          // TODO
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO
        });
      });

      describe('array_item.array_item.object_property', () => {

        beforeEach(() => {
          service['data'] = [
            [
              { name: 'Alice' },
              { name: 'Bob' },
              { name: 'Charlie' }
            ],
            [
              { name: 'Dave' },
              { name: 'Eve' },
              { name: 'Frank' }
            ],
            [
              { name: 'George' },
              { name: 'Hank' },
              { name: 'Ian' }
            ]
          ];
        });
        it('should get a specified value', () => {
          expect(service.get('[].[].name')).toBe('Ian');
          expect(service.get('[1].[2].name')).toBe('Frank');
          expect(service.get('[2].[0].name')).toBe('George');
          expect(service.get('[].[1].name')).toBe('Hank');
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('[3].[0].name')).toBeUndefined();
          expect(service.get('[].[1].nonexistent')).toBeUndefined();
          expect(service.get('[].[].[].[].nonexistent')).toBeUndefined();
          expect(service.get('nonexistent.and.this.and.this.and.this')).toBeUndefined();
          expect(service.get('nonexistent.[].some.[].value')).toBeUndefined();
        });

        it('should return a specified default value for a non-existent', () => {
          expect(service.get('[3].[0].name', 'some_default')).toBe('some_default');
          expect(service.get('[].[1].nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('[].[].[].[].nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.and.this.and.this.and.this', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.[].some.[].value', 'some_default')).toBe('some_default');
        });
      });

      describe('array_item.array_item.array_item', () => {
        it('should get a specified value', () => {
          // TODO
        });

        it('should return undefined for a non-existent', () => {
          // TODO
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO
        });
      });

    });

    describe('nesting level 4', () => {

      describe('object_property.object_property.object_property.object_property', () => {

        beforeEach(() => {
          service['data'] = {
            settings: {
              theme: {
                mode: {
                  type: 'dark'
                }
              }
            }
          };
        });

        it('should get a specified value', () => {
          expect(service.get('settings.theme.mode.type')).toBe('dark');
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('settings.theme.mode.nonexistent')).toBeUndefined();
          expect(service.get('nonexistent.nonexistentToo.andThisOneToo.andTheLastOne')).toBeUndefined();
        });

        it('should return a specified default value for a non-existent', () => {
          expect(service.get('settings.theme.mode.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.nonexistentToo.andThisOneToo.andTheLastOne', 'some_default')).toBe('some_default');
        });

      });

      describe('object_property.object_property.object_property.array_item', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order object_property.object_property.array_item.object_property', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order object_property.array_item.object_property.object_property', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order array_item.object_property.object_property.object_property', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });


      describe('order array_item.object_property.object_property.array_item', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order array_item.object_property.array_item.object_property', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order array_item.array_item.object_property.object_property', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order array_item.array_item.object_property.array_item', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order array_item.array_item.array_item.object_property', () => {

        beforeEach(() => {
          service['data'] = [
            [
              [{ price: 23 }, { price: 7 }, { price: 15 }],
              [{ price: 4 }, { price: 19 }, { price: 11 }],
              [{ price: 26 }, { price: 9 }, { price: 1 }]
            ],
            [
              [{ price: 18 }, { price: 3 }, { price: 25 }],
              [{ price: 13 }, { price: 6 }, { price: 21 }],
              [{ price: 10 }, { price: 27 }, { price: 16 }]
            ],
            [
              [{ price: 8 }, { price: 20 }, { price: 2 }],
              [{ price: 14 }, { price: 5 }, { price: 24 }],
              [{ price: 12 }, { price: 22 }, { price: 17 }]
            ]
          ];
        });

        it('should get a specified value', () => {
          expect(service.get('[].[].[].price')).toBe(17);
          expect(service.get('[2].[2].[2].price')).toBe(17);
          expect(service.get('[2].[0].[1].price')).toBe(20);
          expect(service.get('[0].[0].[0].price')).toBe(23);
          expect(service.get('[2].[].[2].price')).toBe(17);
          expect(service.get('[].[2].[1].price')).toBe(22);
          expect(service.get('[].[].[0].price')).toBe(12);
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('[3].[2].[2].price')).toBeUndefined();
          expect(service.get('[].[2].[5].price')).toBeUndefined();
          expect(service.get('[].[].[100].price')).toBeUndefined();
          expect(service.get('[2].[2].[2].nonexistent')).toBeUndefined();
          expect(service.get('[].[].[0].nonexistent')).toBeUndefined();
          expect(service.get('[].[].[].nonexistent')).toBeUndefined();
        });

        it('should return a specified default value for a non-existent', () => {
          expect(service.get('[3].[2].[2].price', 'some_default')).toBe('some_default');
          expect(service.get('[].[2].[5].price', 'some_default')).toBe('some_default');
          expect(service.get('[].[].[100].price', 'some_default')).toBe('some_default');
          expect(service.get('[2].[2].[2].nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('[].[].[0].nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('[].[].[].nonexistent', 'some_default')).toBe('some_default');
        });

      });

      describe('order array_item.array_item.array_item.array_item', () => {

        it('should get a specified value', () => {
          // TODO add test cases here 
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here 
        });

        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here 
        });

      });

    });

  });

  describe.only('delete()', () => {

    describe('nesting level 1', () => {

      describe('object_property', () => {

        it('should delete object property', () => {
          service = new ObjectNavigator({
            name: 'Alice',
            age: 30,
            isActive: true
          });

          service.delete('isActive');

          expect(service['data']).toEqual({
            name: 'Alice',
            age: 30
          });

        });

      });

      describe('array_item', () => {

        it('should delete array item by index', () => {
          service = new ObjectNavigator([1, 2, 3, 4, 5]);

          service.delete('[2]');

          expect(service['data']).toEqual([1, 2, 4, 5]);
        })

      });

    });

    // TODO add tests for nesting level 2, 3, 4
    // describe('nesting level 2', () => {

    // });

    // describe('nesting level 3', () => {

    // });

    // describe('nesting level 4', () => {

    // });
  });

  describe.skip('edge cases', () => {
    it('should handle empty string keys', () => {
      service.set('', 'root');
      expect(service.get('')).toBe('root');
    });

    it('should handle numeric keys', () => {
      service.set('0', 'zero');
      expect(service.get('0')).toBe('zero');
    });

    it('should throw error when trying to push to a non-array', () => {
      service['data'] = {
        'notAnArray': {}
      };
      expect(() => service.set('notAnArray.[]', 'value')).toThrow('Cannot push to a non-array');
    });
  });
});